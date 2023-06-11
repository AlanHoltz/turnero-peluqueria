const moment = require('moment');
const { User, Param, Turn, FreeDay, Service } = require('../models/index');
const { getDayIntervals } = require('../utils/functions');
const { ENABLE_PHONE_VERIFICATION } = require('../../constants');

const verifyTurn = async (req, res, next, checkOnlyID = false) => {


    if (checkOnlyID) {
        const turn = await Turn.getTurn({ id: req.params.id });
        if (!turn[0]) return res.status(404).send({ err: `No existe un turno con ID: ${req.params.id}` })
        if (turn[0].turn_client_id !== req.decodedJwt.user_id) return res.status(403).send({ err: "No estás autorizado a modificar un turno que no te pertenece" })
        next();

    } else {

        if (ENABLE_PHONE_VERIFICATION) {

            const client = await User.getUserPhoneData(req.decodedJwt.user_id);

            if (client.user_phone === null) return res.status(400).send({ err: "Debes verificar tu teléfono antes de sacar un turno" });
        };
        

        const PARAMS = await Param.getParams();

        /*CHECK IF USER ALREADY HAS A TURN*/
        const clientTurns = await Turn.getTurns({
            client: req.decodedJwt.user_id,
        });


        if (clientTurns.some(turn => turn.turn_state === 1 || turn.turn_state === 2)) {
            return res.status(400).send({ err: "Ya has sacado un turno pendiente de respuesta o que ya ha sido aceptado" })
        };



        const errors = { hairdresser: null, date: null, time: null, services: null, observation: null }

        /*HAIRDRESSER VALIDATION*/

        const hairdresser = Number.isInteger(parseInt(req.body.hairdresser)) ? await User.getHairdresser(req.body.hairdresser) : null;
        const date = moment(req.body.date);
        const time = req.body.time ?? null;
        const timestamp = date && time ? moment(`${date} ${time}`) : null;
        const services = req.body.services;
        const observation = req.body.observation;

        if (!hairdresser) {
            errors.hairdresser = "No existe el peluquero indicado";

        } else {

            if (hairdresser.hairdresser_enabled !== 1) errors.hairdresser = "El peluquero indicado no está disponible en este momento";

        };


        /*DATE && TIME VALIDATION*/

        req.body = { ...req.body, date: date.format("YYYY-MM-DD") };

        if (!timestamp.isValid()) {
            if (!date.isValid()) errors.date = "No has ingresado una fecha válida";
            if (!moment(moment().format("YYYY-MM-DD") + " " + time).isValid()) errors.time = "No has ingresado un tiempo válido para la fecha actual";

        } else {
            const day = timestamp.day() === 0 ? 7 : timestamp.day();
            const hairdresserSchedule = await User.getHairdresserSchedule(hairdresser?.user_id, day);
            const TIME_INTERVAL = PARAMS[1].param_value;
            const MAX_DIFFERENCE_ALLOWED = parseInt(PARAMS[2].param_value);
            const daysDifferenceFromNow = timestamp.diff(Date.now(), "days");

            if (timestamp.isBefore(Date.now()) || daysDifferenceFromNow > MAX_DIFFERENCE_ALLOWED) {
                errors.date = "Fecha y hora no válida(fecha caducada o muy lejana)";
                errors.time = "Fecha y hora no válida(fecha caducada o muy lejana)";
            } else {
                const intervals = getDayIntervals(hairdresserSchedule, TIME_INTERVAL);

                if (!intervals.includes(time)) {
                    errors.time = "Hora ingresada no disponible para el día actual";
                }
                else {
                    const turnsAtDay = await Turn.getTurns({
                        hairdresser: hairdresser.user_id,
                        type: "accepted",
                        month: timestamp.month() + 1,
                        year: timestamp.year(),
                        day: timestamp.date(),
                    })


                    if (turnsAtDay.some(turn => moment(turn.turn_datetime).format("HH:mm") === time)) {
                        errors.time = "Ya hay un turno existente para este horario";
                    }
                    else {
                        const freeDays = await FreeDay.getAll();
                        let dayBetweenFreeDay = false;
                        let i = 0;

                        while (!dayBetweenFreeDay && i < freeDays.length) {
                            const freeDay = freeDays[i];

                            const intervalMoment = {
                                starting: freeDay.free_day_frequency === "anual" ? moment(freeDay.free_day_starting_timestamp).set("year", timestamp.year()) : moment(freeDay.free_day_starting_timestamp),
                                ending: freeDay.free_day_frequency === "anual" ? moment(freeDay.free_day_ending_timestamp).set("year", timestamp.year()) : moment(freeDay.free_day_ending_timestamp)
                            };

                            if (timestamp.isBetween(intervalMoment.starting, intervalMoment.ending, null, "[]")) {
                                dayBetweenFreeDay = true;
                                errors.date = `Fecha y hora no válida(${freeDay.free_day_description})`;
                                errors.time = `Fecha y hora no válida(${freeDay.free_day_description})`;
                            };



                            i++;
                        };

                    };
                };

            };


        };

        /*SERVICES VALIDATION*/

        const totalServices = await Service.getServices();

        if (Array.isArray(services) && services.length > 0) {

            const MAX_SERVICES_ALLOWED = parseInt(PARAMS[3].param_value);

            if (services.length <= MAX_SERVICES_ALLOWED) {
                let badServiceFound = false;
                let i = 0;

                while (!badServiceFound && i < services.length) {

                    const current = services[i];
                    const servicesCpy = [...services];
                    servicesCpy.splice(i, 1)

                    if (!(totalServices.some(tS => tS.service_id === current) && !servicesCpy.includes(current))) {
                        errors.services = `Servicio ID:${current} no existe o ya lo has incluído`;
                        badServiceFound = true;
                    } else {
                        i++;
                    }


                };
            } else {
                errors.services = `Has excedido la cantidad de servicios que puedes solicitar(${MAX_SERVICES_ALLOWED})`;
            };


        } else {
            errors.services = "Debes especificar un arreglo de 1 o más IDs de servicios";
        };


        /*OBSERVATION VALIDATION*/

        if (observation && !(observation.length >= 4 && observation.length < 100)) {
            errors.observation = "Observación entre 4 y 100 carácteres";
        };


        if (Object.values(errors).some(value => value !== null)) return res.send(errors);


        next();
    }



};

module.exports = verifyTurn;