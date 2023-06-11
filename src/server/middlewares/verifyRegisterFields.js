const {
    thereAreErrors
} = require('../utils/functions');
const {
    checkConfirmPassword,
    checkMail,
    checkPassword,
    checkPhone,
    checkUsername
} = require('../utils/validators');


const verifyRegisterFields = async (req, res, next, phoneRequired = true) => {


    const {
        mail,
        phone,
        username,
        password,
        confirmPassword
    } = req.body;


    let phoneStatus = null;

    const mailStatus = await checkMail(mail ? mail.toString() : "");
    if(phoneRequired) phoneStatus = checkPhone(phone ? phone.toString() : "");
    const usernameStatus = checkUsername(username ? username.toString() : "");
    const passwordStatus = checkPassword(password ? password.toString() : "");
    const confirmPasswordStatus = checkConfirmPassword(password ? password.toString() : "", confirmPassword ? confirmPassword.toString() : "");

    const fieldsStatus = {
        mail: mailStatus,
        username: usernameStatus,
        password: passwordStatus,
        confirmPassword: confirmPasswordStatus
    };

    if(phoneRequired) fieldsStatus.phone = phoneStatus;

    const errors = thereAreErrors(fieldsStatus);


    if (errors) return res.send(fieldsStatus);

    next();


};

module.exports = verifyRegisterFields;