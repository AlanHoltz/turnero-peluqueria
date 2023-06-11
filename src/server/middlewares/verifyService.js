const { Service } = require('../models/index');

const verifyService = async (req, res, next, checkID = false, checkOnlyID = false) => {
    const { serviceName, serviceEstimatedTime, serviceCost } = req.body;

    const serviceID = req.params.id;

    let errors = {};

    if (checkID || checkOnlyID) {
        const service = await Service.getService(serviceID);
        if (!service) return res.status(!serviceID ? 400 : 404).send(
            { err: !serviceID ? "No has indicado el ID del servicio" : `No existe un servicio con ID: ${serviceID}` });
    };

    if (checkOnlyID) return next();


    if (!(serviceName && serviceName.length >= 2 && serviceName.length <= 30)) {

        errors = { ...errors, serviceName: "Entre 2 y 30 carácteres" }

    };

    if (!(!Number.isNaN(parseInt(serviceEstimatedTime)) && serviceEstimatedTime >= 60000)) {
        errors = { ...errors, serviceEstimatedTime: "Deber ser un número y superar o ser 60000 milisegundos" }
    };

    if (!(!Number.isNaN(parseInt(serviceCost)) && serviceCost > 0)) {
        errors = { ...errors, serviceCost: "Deber ser un número y superar o ser $1" }
    };

    if (Object.keys(errors).length > 0) return res.send(errors);

    next();

};

module.exports = verifyService;