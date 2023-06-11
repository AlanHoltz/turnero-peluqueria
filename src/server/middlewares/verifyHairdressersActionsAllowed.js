const validator = require('validator');
const {User} = require('../models/index');

const throwError = (req, res, next, reason, status = 400) => {

    res.status(status);
    res.send({
        error: reason
    })

};

const verifyHairdressersActionsAllowed = async (req, res, next, id, skipIfSameUsers) => {


    if (!validator.isNumeric(id)) return throwError(req, res, next, "El ID debe ser numérico");


    const requestHairdresserPrivileges = req.decodedJwt.hairdresser_privilege_id;
    const requestHairdresserID = req.decodedJwt.user_id;

    if (skipIfSameUsers) {      /*SI LA BANDERA skipIfSameUsers ESTÁ EN true Y EL USUARIO ES EL MISMO*/
                                /*QUE SOLICITA LA OPERACIÓN NO SE COMPRUEBAN LOS PRIVILEGIOS*/
        if (requestHairdresserID === parseInt(id)) return next();
    }


    const hairdresserToChange = await User.getHairdresser(id);
    if (!hairdresserToChange) return throwError(req, res, next, `No existe un peluquero con ID: ${id}`, 404);

    const hairdresserToChangePrivileges = hairdresserToChange.hairdresser_privilege_id;

    if (requestHairdresserPrivileges >= hairdresserToChangePrivileges) return throwError(req, res, next, "No tiene los permisos suficientes", 403)

    next();
};

module.exports = verifyHairdressersActionsAllowed;