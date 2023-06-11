const moment = require('moment');
const { FreeDay } = require('../models/index');

const verifyFreeDay = async (req, res, next, checkID = false, checkOnlyID = false) => {

    if (checkID) {
        const freeDay = await FreeDay.getOne(req.params.id);
        if (!freeDay[0]) return res.status(404).send({ error: "ID ingresado no corresponde a ningún día libre" });
    };

    if (checkOnlyID) return next();

    const errors = {
        free_day_description: null,
        free_day_starting_timestamp: null,
        free_day_ending_timestamp: null,
        free_day_frequency: null
    };



    if (!(req.body.free_day_description?.length >= 4 && req.body.free_day_description?.length <= 30)) {
        errors.free_day_description = "Entre 4 y 30 carácteres"
    };

    const startingDate = moment(req.body?.free_day_starting_timestamp ?? null);
    const endingDate = moment(req.body?.free_day_ending_timestamp ?? null);

    if (!startingDate.isValid()) {
        errors.free_day_starting_timestamp = "Ingrese una fecha y hora válida";
    };

    if (!endingDate.isValid()) {
        errors.free_day_ending_timestamp = "Ingrese una fecha y hora válida";
    };

    if (startingDate.isValid() && endingDate.isValid() && !endingDate.isAfter(startingDate)) {
        errors.free_day_ending_timestamp = "Elija una fecha y hora posterior a la inicial";
    };

    if (!req.body.free_day_frequency || !["anual", "once"].includes(req.body.free_day_frequency)) {
        errors.free_day_frequency = "La frecuencia debe ser 'once' o 'anual'";
    };

    if (startingDate.isValid() && endingDate.isValid() && endingDate.isAfter(startingDate) && (endingDate.diff(startingDate, "days") > 365)) {
        errors.free_day_ending_timestamp = "Elija una fecha y hora menor a 364 días con respecto a la inicial";
    };

    if (Object.values(errors).some(error => error !== null)) return res.send(errors);

    next();
};

module.exports = verifyFreeDay;