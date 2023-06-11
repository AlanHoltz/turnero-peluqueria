const validate = require('validate.js');

const verifyParameters = (req, res, next, paramsToCheck, paramsRestrictions) => {

    const valid = validate(paramsToCheck, paramsRestrictions);

    if (valid === undefined) return next();
    return res.status(400).send(valid)

};

module.exports = verifyParameters;