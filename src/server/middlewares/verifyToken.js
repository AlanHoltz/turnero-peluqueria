const jwt = require('jsonwebtoken');
const {
    JWT_COOKIE_NAME
} = require('../../constants');

const verifyToken = (req, res, next) => {
    const jwtCookie = req.cookies[JWT_COOKIE_NAME];
    if (!jwtCookie) {
        res.send({
            isLogged: false
        });
    } else {
        handleVerifyToken(jwtCookie, req, res, next);
    };

};


const handleVerifyToken = (jwtCookie, req, res, next) => {
    try {
        let decodedJwt = jwt.verify(jwtCookie, process.env.JWT_TOKEN);
        delete decodedJwt.iat;
        req.decodedJwt = decodedJwt;
        next();
    } catch (err) {
        res.sendStatus(403);
    }
};

module.exports = verifyToken;