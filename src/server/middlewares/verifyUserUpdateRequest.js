const {
    checkUsername,
    checkPassword,
    checkMail,
    checkPhone
} = require('../utils/validators');
const {
    thereAreErrors
} = require('../utils/functions');
const _ = require('lodash');

const verifyUserUpdateRequest = async (req, res, next, phoneRequired) => {

    const fieldsArray = _.toPairs(req.body);


    if (fieldsArray.length === 0) return res.send({
        error: "No tienes datos para modificar"
    });

    let i = 0;
    let fieldAvailable = false;
    let expectedFields = ["mail", "password", "username"];

    if (phoneRequired) expectedFields.push("phone");

    if (req.decodedJwt.hairdresser_privilege_id) expectedFields.push("hairdresser_privilege_id");

    while (i < fieldsArray.length && !fieldAvailable) {
        /*PRIMERO VALIDO SI EL OBJETO 
         TIENE ALGÚN CAMPO EDITABLE*/
        const field = fieldsArray[i][0];

        if (!expectedFields.includes(field)) {
            return res.send({
                error: `Campo ${field} no disponible para modificar. Solo ${expectedFields} aceptados.`
            });
        };

        i += 1;
    };


    let fieldsStatus = {};


    for (const field of fieldsArray) {
        switch (field[0]) {
            case "username":
                fieldsStatus = {
                    ...fieldsStatus,
                    username: checkUsername(typeof field[1] === "string" ? field[1].toString() : "")
                }
                break;
            case "mail":
                const tempMail = await checkMail(field[1].toString());
                fieldsStatus = {
                    ...fieldsStatus,
                    mail: tempMail
                }
                break;
            case "phone":
                if (!phoneRequired) break;
                fieldsStatus = {
                    ...fieldsStatus,
                    phone: checkPhone(field[1].toString())
                }
                break;
            case "password":
                fieldsStatus = {
                    ...fieldsStatus,
                    password: checkPassword(field[1].toString())
                }
                break;
            default:
                break;
        }
    }


    if (thereAreErrors(fieldsStatus)) return res.send(fieldsStatus);


    next();

};

module.exports = verifyUserUpdateRequest;