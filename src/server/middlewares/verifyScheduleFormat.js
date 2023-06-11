const HOUR_REGEX = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
const moment = require('moment');

const turnHasCorrectValue = (turn) => {

    let error = {
        starting: null,
        ending: null
    };

    if (!(turn[0] && turn[1])) error.starting = error.ending = "requested";

    if (error.starting === null && !HOUR_REGEX.test(turn[0])) error.starting = "format"
    if (error.ending === null && !HOUR_REGEX.test(turn[1])) error.ending = "format"

    if (error.starting === null) {

        const turnMomentStarting = moment(new Date("2021-12-20T" + turn[0]));

        const turnMomentEnding = moment(new Date("2021-12-20T" + turn[1]));


        if (turnMomentStarting.isSameOrAfter(turnMomentEnding)) {
            error.starting = "order";
            error.ending = "order";
        }
    }

    return error;
};


const turnHasFormat = (turn) => turn === null || (Array.isArray(turn));

const checkDayTurns = (day, res) => {


    const firstTurn = day.firstTurn;
    const secondTurn = day.secondTurn;

    let error = {       /*SE INICIALIZA EL OBJETO DE ERRORES, SI ESTE TERMINA CON TODAS SUS PROPIEDADES NULAS*/
        /*QUIERE DECIR QUE LOS HORARIOS PARA UN DÍA SON CORRECTOS*/
        day: day.day,
        firstTurnStartingTime: null,
        firstTurnEndingTime: null,
        secondTurnStartingTime: null,
        secondTurnEndingTime: null
    };


    /*LOS DÍAS DEBEN CONTENER HORARIOS PARA LOS CUALES PUEDEN SER NULOS(NO SE TRABAJA EN UN  TURNO)*/
    /*O UN ARRAY, EN EL CUÁL SE ESPECIFICA EL RANGO HORARIO A TRABAJAR*/
    if (!turnHasFormat(firstTurn) || !turnHasFormat(secondTurn)) {
        res.status(400);
        if (!turnHasFormat(firstTurn)) res.send({
            error: `El primer turno de ${day.day} tiene que ser null/array`
        })
        else res.send({
            error: `El segundo turno de ${day.day} tiene que ser null/array`
        })

        return -1;
    }


    /*PARA QUE HAYA UN SEGUNDO TURNO TIENE QUE HABER DE ANTEMANO UN PRIMER TURNO*/
    if (firstTurn === null) {
        if (secondTurn !== null) {
            error = { ...error, firstTurnStartingTime: "requested", firstTurnEndingTime: "requested" };
        }
    };


    if (Array.isArray(firstTurn)) {

        const firstTurnErrors = turnHasCorrectValue(firstTurn);

        error = {
            ...error,
            firstTurnStartingTime: firstTurnErrors.starting,
            firstTurnEndingTime: firstTurnErrors.ending
        }


    };

    if (Array.isArray(secondTurn) && Array.isArray(firstTurn)) {


        const secondTurnErrors = turnHasCorrectValue(secondTurn);

        error = {
            ...error,
            secondTurnStartingTime: secondTurnErrors.starting,
            secondTurnEndingTime: secondTurnErrors.ending
        }

        const firstTurnEndingTime = moment(new Date("2021-12-20T" + firstTurn[1]));
        const secondTurnStartingTime = moment(new Date("2021-12-20T" + secondTurn[0]));

        if (firstTurnEndingTime.isAfter(secondTurnStartingTime)) {

            error = { ...error, firstTurnEndingTime: "order", secondTurnStartingTime: "order" }
        }

    };

    return error;



};

const someErrors = (errors) => errors.some(error => Object.entries(error).some((value, index) => value[1] !== null && index !== 0));

const verifyScheduleFormat = (req, res, next) => {


    let possibleDays = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
    let i = 0;
    let errors = [];

    if (!Array.isArray(req.body)) {
        return res.status(400).send({
            error: "Debes pasar un array de días"
        })
    };


    while (i < req.body.length) {
        //MIENTRAS HAYA DÍAS POR VERIFICAR, CADA UNO DE ESTOS SON COMPROBADOS SINTÁCTICAMENTE, SINO, SE RETORNA UN OBJETO
        // CON LOS RESPECTIVOS ERRORES 
        if (possibleDays.includes(req.body[i].day)) {
            const possibleDayIndex = possibleDays.findIndex(day => day === req.body[i].day);
            possibleDays.splice(possibleDayIndex, 1);

            errors = [...errors, checkDayTurns(req.body[i], res)]

        } else {
            return res.status(400).send({
                error: `El día ${req.body[i].day} no existe`
            });
        };

        i += 1;
    };



    if (someErrors(errors)) return res.send(errors);

    next();







};

module.exports = verifyScheduleFormat;