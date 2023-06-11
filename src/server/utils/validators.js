const {User} = require('../models/index');
const validator = require('validator');
const {
    validate
} = require('deep-email-validator');

const checkMail = async (mail) => {


    const MAIL_REGEX = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/

    if (!MAIL_REGEX.test(mail)) return {
        error: true,
        reason: "Ingrese un E-Mail válido"
    };

    /*let availableMail = await validate(mail);
    availableMail = availableMail.valid;

    if (!availableMail) return {
        error: true,
        reason: "El E-Mail no está disponible o no existe"
    };*/

    const mailExists = await User.mailAlreadyExists(mail);

    if(mailExists) return {error:true, reason: "El E-Mail ya se encuentra en uso"}

    return {
        error: false,
        reason: null
    };

};

const checkPhone = (phone) => {
    const isValid = validator.isMobilePhone(phone)
    return {
        error: !isValid,
        reason: isValid ? null : "Ingrese un teléfono correcto"
    }
};

const checkUsername = (username) => {
    const trim = validator.rtrim(username);
    const isValid = trim.length >= 4 && trim.length <= 25;
    return {
        error: !isValid,
        reason: isValid ? null : "Entre 4 y 25 carácteres"
    };
};

const checkPassword = (password) => {
    const PASSWORD_REGEX = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,45}$/
    const isValid = PASSWORD_REGEX.test(password);
    return {
        error: !isValid,
        reason: isValid ? null : "Al menos 8 carácteres, una minúscula, una mayúscula y un número"
    }
};

const checkConfirmPassword = (password, confirmPassword) => {
    let reason = null;
    const passwordIsInvalid = checkPassword(password).error;
    const passwordsNotEquals = !validator.equals(password, confirmPassword);
    if (passwordIsInvalid) reason = "La contraseña no es válida";
    if (passwordsNotEquals) reason = "Las contraseñas no coinciden";
    return {
        error: passwordIsInvalid || passwordsNotEquals,
        reason
    };
};

module.exports = {checkConfirmPassword,checkMail,checkPassword,checkPhone,checkUsername}