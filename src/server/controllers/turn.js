const { Turn, User, Param, FreeDay, Statistic } = require('../models/index');
const moment = require('moment');
const {
    getDifference,
    getDatesInterval
} = require('../../functions/dateHandler');
const {
    ACCEPTED_DELETE_TIME,
    REJECTED_DELETE_TIME,
    PENDING_TO_REJECTED_TIME,
    MAP_TURNS_IN
} = require('../../constants');
const _ = require('lodash');
const fileHandler = require('../utils/fileHandler');
const { getDayIntervals } = require('../utils/functions');
const logger = require('../log');

class TurnController {

    constructor() {
        this.getUnavailableDates = this.getUnavailableDates.bind(this);
        this.getAvailableTimes = this.getAvailableTimes.bind(this);
    }

    async getTurns(req, res) {
        const turns = await Turn.getTurns({ type: req.query.type, size: req.query.size, hairdresser: req.query.hairdresser });
        res.send(turns);
    };


    /*----------------------FUNCIONES PARA LAS FECHAS NO DISPONIBLES Y LOS TIEMPOS DISPONIBLES PARA UNA FECHA--------------*/

    #hairdresserIsNotWorking(day) {
        return (day.hairdresser_work_day_ft_starting_time === null &&
            day.hairdresser_work_day_ft_ending_time === null
            && day.hairdresser_work_day_st_starting_time === null
            && day.hairdresser_work_day_st_ending_time === null);
    }

    async #getHairdresserDaysIntervals(hairdresser, selectedDate = null) {

        const PARAMS = await Param.getParams();
        const TIME_INTERVAL = PARAMS[1].param_value;

        /*SE PUEDE ELEGIR UNA FECHA O TRABAJAR CON TODOS LOS DÍAS DE LA SEMANA*/

        if (selectedDate && moment(selectedDate).isValid()) {
            const hairdresserDay = await User.getHairdresserSchedule(hairdresser, moment(selectedDate).day() === 0 ? 7 : moment(selectedDate).day());
            if (!hairdresserDay) return -1;

            if (this.#hairdresserIsNotWorking(hairdresserDay)) {
                return null;
            } else {
                return getDayIntervals(hairdresserDay, TIME_INTERVAL);
            };


        } else {
            const hairdresserSchedule = await User.getHairdresserSchedule(hairdresser);

            const hairdresserNotWorking = [];

            if (hairdresserSchedule.length === 0) return -1;


            let daysIntervals = {};


            hairdresserSchedule.forEach(day => {

                const dayNum = day.work_day_id === 7 ? 0 : day.work_day_id;

                if (this.#hairdresserIsNotWorking(day)) {
                    daysIntervals[dayNum] = null;
                    hairdresserNotWorking.push(dayNum);
                } else {

                    daysIntervals[dayNum] = getDayIntervals(day, TIME_INTERVAL);


                };
            });

            return { daysIntervals, hairdresserNotWorking };
        };


    };



    async #getDateAvailableTimes(dateToCheck, hairdresser) {
        const date = moment(dateToCheck);
        const dateString = date.format("YYYY-MM-DD").toString();

        if (date.isValid()) {

            let dayInterval = await this.#getHairdresserDaysIntervals(hairdresser, date.format("YYYY-MM-DD"));
            if (dayInterval === -1) return { err: "Peluquero no existe" };

            if (dayInterval === null) return [];

            if (moment(dateString).isSame(moment().format("YYYY-MM-DD"))) {
                dayInterval = dayInterval.filter(time => !moment(`${dateString} ${time}`).isSameOrBefore(moment()));
            };

            const turnsAtDay = await Turn.getTurns({
                hairdresser: hairdresser,
                type: "accepted",
                month: date.month() + 1,
                year: date.year(),
                day: date.date(),
            })

            const busyTimes = turnsAtDay.map(turn => moment(turn.turn_datetime).format("HH:mm"));

            dayInterval = _.difference(dayInterval, busyTimes);



            const freeDays = await FreeDay.getAll();


            let i = 0;

            while (i < freeDays.length && dayInterval.length > 0) {
                const day = freeDays[i];
                const intervalMoment = {
                    starting: day.free_day_frequency === "anual" ? moment(day.free_day_starting_timestamp).set("year", date.year()) : moment(day.free_day_starting_timestamp),
                    ending: day.free_day_frequency === "anual" ? moment(day.free_day_ending_timestamp).set("year", date.year()) : moment(day.free_day_ending_timestamp)
                };


                const dayString = {
                    starting: intervalMoment.starting.format(`YYYY-MM-DD`).toString(),
                    ending: intervalMoment.ending.format(`YYYY-MM-DD`).toString(),
                };


                if (dayString.starting === dateToCheck) {
                    dayInterval = dayInterval.filter(time => !moment(`${dateToCheck} ${time}`).isBetween(intervalMoment.starting, moment(`${dayString.starting} 23:59`), null, "[]"))
                }
                else if (dayString.ending === dateToCheck) {
                    dayInterval = dayInterval.filter(time => !moment(`${dateToCheck} ${time}`).isBetween(moment(`${dayString.ending} 00:00`), intervalMoment.ending, null, "[]"))
                }
                else if (date.isBetween(intervalMoment.starting, intervalMoment.ending, null, "[]")) {
                    dayInterval = [];
                };

                i++;
            }


            return dayInterval;


        } else {
            return { err: "date debe ser un formato de fecha correcto" };
        };
    };

    async #getUnavailableDatesByHairdresser(month, year, hairdresser) {

        const unavailableDates = {
            hairdresserNotWorking: [],
            unavailableDaysByTurns: [],
            unavailableDaysByFreeDays: [],
        };


        /*PASO 1 - SE CALCULAN LOS HORARIOS PARA CADA DÍA LABORAL DEL PELUQUERO*/
        /*SI NO TRABAJA EN UN DÍA SE GUARDA EN unavailableDates.hairdresserNotWorking*/


        const hairdresserSchedule = await this.#getHairdresserDaysIntervals(hairdresser);


        if (hairdresserSchedule === -1) return { err: "Peluquero no existe" };

        const { daysIntervals, hairdresserNotWorking } = hairdresserSchedule;

        unavailableDates.hairdresserNotWorking = [...hairdresserNotWorking];


        /*PASO 2 - SE VERIFICA QUE HAYA DÍAS QUE NO CONTENGAN AL MENOS UN TURNO DISPONIBLE*/
        /*SI UN DÍA NO ESTÁ DISPONIBLE SE GUARDA EN unavailableDates.unavailableDaysByTurns*/

        const acceptedTurns = await Turn.getTurns({
            hairdresser: hairdresser,
            type: "accepted",
            month: month,
            year: year,
        });
        
        let acceptedTurnsTimes = {};

        acceptedTurns.forEach(turn => {
            const dayMoment = moment(turn.turn_datetime);
            const dayString = dayMoment.format("YYYY-MM-DD").toString();
            const timeString = dayMoment.format("HH:mm").toString();
            const dayNumber = dayMoment.day() === 0 ? 7 : dayMoment.day();

            if (daysIntervals[dayNumber]) {

                if (!acceptedTurnsTimes[dayString]) acceptedTurnsTimes[dayString] = [...daysIntervals[dayNumber]]

                const valIndex = acceptedTurnsTimes[dayString].indexOf(timeString);
                acceptedTurnsTimes[dayString].splice(valIndex, 1);

                if (acceptedTurnsTimes[dayString].length === 0 && !unavailableDates.unavailableDaysByTurns.includes(dayString)) {
                    unavailableDates.unavailableDaysByTurns.push(dayString)
                };
            };

        });


        /*PASO 3 - SE VERIFICAN LOS DÍAS LIBRES PARA DESCONTARLOS DE LOS DISPONIBLES */

        const freeDays = await FreeDay.getAll();

        freeDays.forEach(day => {

            const intervalMoment = {
                starting: day.free_day_frequency === "anual" ? moment(day.free_day_starting_timestamp).set("year", year) : moment(day.free_day_starting_timestamp),
                ending: day.free_day_frequency === "anual" ? moment(day.free_day_ending_timestamp).set("year", year) : moment(day.free_day_ending_timestamp)
            };


            const dayString = {
                starting: intervalMoment.starting.format(`YYYY-MM-DD`).toString(),
                ending: intervalMoment.ending.format(`YYYY-MM-DD`).toString(),
            };


            const intervalDayNumber = {
                starting: intervalMoment.starting.day() === 0 ? 7 : intervalMoment.starting.day(),
                ending: intervalMoment.ending.day() === 0 ? 7 : intervalMoment.ending.day()
            };


            const checkForUnavailableDaysOnFreeDays = ({ dayInterval, dayIntervalNumber, intervalMomentStarting, intervalMomentEnding }) => {

                if (!daysIntervals[dayIntervalNumber]) return;

                const currentDayTimes = acceptedTurnsTimes[dayInterval] ? [...acceptedTurnsTimes[dayInterval]] : [...daysIntervals[dayIntervalNumber]];
                const filteredAvailableCurrentDayTimes = currentDayTimes.filter(time => !moment(dayInterval + ` ${time}`).isBetween(intervalMomentStarting, intervalMomentEnding), null, "[]");


                if (filteredAvailableCurrentDayTimes.length === 0 &&
                    !unavailableDates.unavailableDaysByFreeDays.includes(dayInterval) &&
                    !unavailableDates.unavailableDaysByTurns.includes(dayInterval)
                ) {
                    unavailableDates.unavailableDaysByFreeDays.push(dayInterval)
                };

            };


            if (dayString.starting === dayString.ending) {

                checkForUnavailableDaysOnFreeDays({
                    dayInterval: dayString.starting,
                    dayIntervalNumber: intervalDayNumber.starting,
                    intervalMomentStarting: intervalMoment.starting,
                    intervalMomentEnding: intervalMoment.ending,

                });

            } else {
                const daysInTheMiddle = getDatesInterval(moment(dayString.starting).add(1, "day").format("YYYY-MM-DD"), dayString.ending)
                unavailableDates.unavailableDaysByFreeDays = [...unavailableDates.unavailableDaysByFreeDays, ...daysInTheMiddle]


                checkForUnavailableDaysOnFreeDays({
                    dayInterval: dayString.starting,
                    dayIntervalNumber: intervalDayNumber.starting,
                    intervalMomentStarting: intervalMoment.starting,
                    intervalMomentEnding: moment(dayString.starting + " 23:59"),

                });

                checkForUnavailableDaysOnFreeDays({
                    dayInterval: dayString.ending,
                    dayIntervalNumber: intervalDayNumber.ending,
                    intervalMomentStarting: moment(dayString.ending + " 00:00"),
                    intervalMomentEnding: intervalMoment.ending,

                });
            };

        });

        /*PASO 4 - VERIFICO SI EL DÍA ACTUAL A LA PETICIÓN TIENE AÚN HORARIOS DISPONIBLES*/

        const today = moment().format("YYYY-MM-DD");

        if (!unavailableDates.unavailableDaysByFreeDays.includes(today) &&
            !unavailableDates.unavailableDaysByTurns.includes(today)) {

            const todayTimes = await this.#getDateAvailableTimes(today, hairdresser);

            if (todayTimes.length === 0) unavailableDates.unavailableDaysByTurns.push(today);


        };

        return unavailableDates;
    };
    /*---------------------------------------------------------------------------------------------------------------------*/


    async getUnavailableDates(req, res) {

        if (req.query.hairdresser !== "null" && Number.isInteger(parseInt(req.query.hairdresser))) {
            return res.send(await this.#getUnavailableDatesByHairdresser(req.query.month, req.query.year, req.query.hairdresser));
        } else if (req.query.hairdresser === "null") {

            const hairdressers = await User.getHairdressers();

            const unavailableDates = {
                hairdresserNotWorking: [],
                unavailableDaysByTurns: [],
                unavailableDaysByFreeDays: [],
            };

            for (let i in hairdressers) {
                const hairdresser = hairdressers[i];
                const hairdresserUnavailableDates = await this.#getUnavailableDatesByHairdresser(req.query.month, req.query.year, hairdresser.user_id);
                if (parseInt(i) === 0) unavailableDates.unavailableDaysByFreeDays = [...hairdresserUnavailableDates.unavailableDaysByFreeDays];
                unavailableDates.hairdresserNotWorking.push(hairdresserUnavailableDates.hairdresserNotWorking);
                unavailableDates.unavailableDaysByTurns.push(hairdresserUnavailableDates.unavailableDaysByTurns);
            };

            unavailableDates.hairdresserNotWorking = _.intersection(...unavailableDates.hairdresserNotWorking);
            unavailableDates.unavailableDaysByTurns = _.intersection(...unavailableDates.unavailableDaysByTurns);

            res.send(unavailableDates);


        } else {
            res.send({ err: "hairdresser debe ser entero o null" });

        };
    };

    async getAvailableTimes(req, res) {
        if (req.query.hairdresser !== "null" && Number.isInteger(parseInt(req.query.hairdresser))) {
            return res.send(await this.#getDateAvailableTimes(req.query.date, req.query.hairdresser));
        } else if (req.query.hairdresser === "null") {
            const hairdressers = await User.getHairdressers();
            const hairdressersTimesForDate = {};

            for (let i in hairdressers) {
                const hairdresser = hairdressers[i];
                hairdressersTimesForDate[hairdresser.user_id] = await this.#getDateAvailableTimes(req.query.date, hairdresser.user_id);
            };

            res.send(hairdressersTimesForDate);
        } else {
            res.send({ err: "hairdresser debe ser entero o null" });

        };
    };

    async getMyTurn(req, res) {

        let turnServices;

        const possibleTurn = await Turn.getTurns({ last: true, client: req.decodedJwt.user_id, size: "detailed" });

        if (possibleTurn[0]) {

            turnServices = await Turn.getTurnServices(possibleTurn[0].turn_id);

        };

        res.send({ turn: possibleTurn[0], services: turnServices });
    };

    async getTurnByID(req, res) {

        const id = req.params.id;
        const size = req.query.size;

        const turn = await Turn.getTurn({
            id,
            size
        });

        res.send(turn);
    };

    async getHairdresserNextTurn(req, res) {

        if (!(req.params.user === "general" || Number.isInteger(parseInt(req.params.user)))) {
            return res.send({ err: "user must be 'general' or an integer" });
        };

        res.send(await Turn.getNextTurn(req.params.user));
    };

    async getTurnServices(req, res) {
        res.send(await Turn.getTurnServices(req.params.id));
    };

    async createTurn(req, res) {

        try {

            const newTurn = await Turn.createTurn({ ...req.body, client: req.decodedJwt.user_id });
            await Turn.addServicesToTurn(newTurn.insertId, req.body.services);

            socket.emit("UPDATE_TURNS", "CREATED");

            res.send({ created: newTurn.insertId });

            logger.info(req, `Turn with ID: ${newTurn.insertId} has been created`);
        }

        catch (e) {
            res.status(500).send({ error: e.toString() });
            logger.error(req, e);
        };
    };

    async updateTurnPhoto(req, res) {
        const uploadFile = {
            mainFolder: "turns",
            customizedFolder: req.params.id,
            req: req,

        };

        fileHandler.upload(uploadFile, async (err, randomFilename) => {

            try {

                if (err) return res.status(400).send({ error: err });

                await Turn.updateTurnPhoto(req.params.id, randomFilename);


                res.send({
                    updated: true
                });

                logger.info(req, `Turn with ID: ${req.params.id} photo has been updated`);
            }

            catch (e) {
                res.status(500).send({ error: e.toString() });
                logger.error(req, e);
            };

        })
    };

    async updateTurn(req, res) {
        try {

            const errors = { state: null, observation: null };

            const id = req.params.id;
            const state = req.body.state;
            const observation = req.body.observation;

            let turn = await Turn.getTurn({ id: req.params.id });
            turn = turn[0];


            if (!turn) return res.status(404).send({ error: "No existe un turno con ese ID" });

            const dateMoment = moment(turn.turn_datetime);

            if (!state || !["accepted", "rejected"].includes(state)) errors.state = `Solamente ${["accepted", "rejected"]}`;

            if (observation && !(observation.length >= 4 && observation.length < 100)) errors.observation = "Entre 4 y 100 carácteres";

            if (errors.state || errors.observation) return res.send(errors);


            if (turn.turn_state === 3) return res.send({ err: "No puedes modificar un turno que ya ha sido rechazado" });


            if (turn.turn_state === 2) {
                const query = {};
                const column = state === "accepted" ? "accepted_turns" : "rejected_turns";
                query[column] = `${column} + 1`;
                await Statistic.updateStatistics({ hairdresser: turn.turn_hairdresser_id, month: dateMoment.month() + 1, year: dateMoment.year() }, query);
            };


            const updatedTurn = await Turn.updateTurn({
                id,
                state,
                observation
            });

            //SI EL TURNO FUE RECHAZADO ESTANDO ACEPTADO SE DESCUENTA EL PRECIO DE LAS GANANCIAS

            if (turn.turn_state === 1 && state === "rejected") {
                await Statistic.updateStatistics({ hairdresser: turn.turn_hairdresser_id, month: dateMoment.month() + 1, year: dateMoment.year() }, { earnings: `earnings - ${await Turn.getTurnTotalCost(turn.turn_id)}`, accepted_turns: "accepted_turns - 1", rejected_turns: "rejected_turns + 1" });
            };

            /*SI YA HAY TURNOS PENDIENTES PARA LA MISMA HORA Y FECHA SE RECHAZAN YA QUE SE HA ACEPTADO UNO*/
            if (state === "accepted") {
                const turnMoment = moment(turn.turn_datetime);
                const time = turnMoment.format("HH:mm");
                const turnsAtDay = await Turn.getTurns({
                    type: "pending",
                    month: turnMoment.month() + 1,
                    year: turnMoment.year(),
                    day: turnMoment.date(),
                })

                let i = 0;

                while (i < turnsAtDay.length) {

                    const currentTurn = turnsAtDay[i];

                    if (moment(currentTurn.turn_datetime).format("HH:mm") === time) {
                        await Turn.updateTurn({ id: currentTurn.turn_id, state: "rejected" });
                    };

                    i++;
                };


                //SE AUMENTAN LAS ESTADÍSTICAS DEL DINERO
                await Statistic.updateStatistics({ hairdresser: turn.turn_hairdresser_id, month: dateMoment.month() + 1, year: dateMoment.year() }, { earnings: `earnings + ${await Turn.getTurnTotalCost(turn.turn_id)}` });

            };

            socket.emit("UPDATE_TURNS", "MODIFIED");

            res.send(updatedTurn);

            logger.info(req, `Turn with ID: ${req.params.id} has been updated`);
        }

        catch (e) {
            res.status(500).send({ error: e.toString() });
            logger.error(req, e);
        };
    };

    async deleteTurn(req, res) {
        try {

            let turn = await Turn.getTurn({ id: req.params.id });
            turn = turn[0];

            if (!turn) res.status(404).send({ err: "No hay un turno con ese ID" });

            const dT = await Turn.deleteTurn(req.params.id);

            socket.emit("UPDATE_TURNS", "DELETED");

            res.send(dT);

            logger.info(req, `Turn with ID: ${req.params.id} has been deleted`);
        }

        catch (e) {
            res.status(500).send({ error: e.toString() });
            logger.error(req, e);
        };
    };


};

/*COMPROBADOR DE TURNOS VENCIDOS Y RECHAZADOS QUE DEBEN SER ELIMINADOS O PENDIENTES SIN RESPONDER*/


const checkCurrentTurnsValidity = async () => {
    const turns = await Turn.getTurns({
        size: "all"
    });
    turns.forEach(turn => checkTurnValidity(turn));
};


/*MAPEA CADA N MILISEGUNDOS CADA TURNO PARA CORROBORAR QUE ESTE NO ESTÉ VENCIDO*/
setInterval(checkCurrentTurnsValidity, MAP_TURNS_IN * 60000);



const checkTurnValidity = (turn) => {

    const turnState = turn.turn_state;

    if (turnState === 1) return deleteTurnInTime(turn, ACCEPTED_DELETE_TIME);
    if (turnState === 2) return changePendingTurnToRejected(turn);
    if (turnState === 3) return deleteTurnInTime(turn, REJECTED_DELETE_TIME);

};


const changePendingTurnToRejected = async (turn) => {

    if (PENDING_TO_REJECTED_TIME < 0) throw new Error("PENDING_TO_REJECTED_TIME must be positive");

    const difference = getDifference(turn.turn_datetime, new Date());

    if (difference < PENDING_TO_REJECTED_TIME) {
        await Turn.updateTurn({
            id: turn.turn_id,
            observation: "El turno ha sido rechazado por no contestar a tiempo",
            state: "rejected"
        });

        socket.emit("UPDATE_TURNS", "AUTO_MODIFIED");

    }
};

const deleteTurnInTime = async (turn, time) => {

    if (time < 0) throw new Error("time must be positive");


    const difference = getDifference(new Date(), turn.turn_datetime);

    if (difference > time) {
        await Turn.deleteTurn(turn.turn_id);

        socket.emit("UPDATE_TURNS", "DELETED");

    };
};




module.exports = new TurnController();