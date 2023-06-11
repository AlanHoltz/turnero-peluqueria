const winston = require('winston');
const moment = require('moment');
const requestIp = require('request-ip');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.printf(({level,message,label,timestamp}) => `[${moment().format("YYYY-MM-DD HH:mm")}] - ${message}`),
    transports: [
        new winston.transports.File({ filename: 'log.log'}),
    ],
});

const usedLogger = {
    info: (req, message) => {logger.info(`${requestIp.getClientIp(req)}${req.decodedJwt ? ` - ${req.decodedJwt.user_full_name}` : ""} | ${message}\n\n`)},
    error: (req,error) => {
        logger.error(`${requestIp.getClientIp(req)}${req.decodedJwt ? ` - ${req.decodedJwt.user_full_name}` : ""}\n${error.stack}\n\n`)
    },
    getInstance: () => logger,


};

module.exports = usedLogger;