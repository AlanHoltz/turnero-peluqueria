const {
    JWT_COOKIE_NAME
} = require('../../constants');
const { User } = require('../models/index');
const jwt = require('jsonwebtoken');
const { getTimesInterval } = require('../../functions/dateHandler');

const thereAreErrors = (fieldsStatus) => {
    const fieldsStatusArray = Object.entries(fieldsStatus);
    return fieldsStatusArray.some(field => field[1].error);
};

const refreshToken = async (req, res, onTokenRefresh) => {

    const userData = await User.getOneByMail(req.decodedJwt.user_mail);

    try {
        const JWT_TOKEN = jwt.sign({
            ...userData
        }, process.env.JWT_TOKEN, {
            expiresIn: "1d"
        });
        res.cookie(JWT_COOKIE_NAME, JWT_TOKEN, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24
        });

        onTokenRefresh ? onTokenRefresh() : null;

    } catch (e) {

    }

};

const getDayIntervals = (day, interval) => {


    const dayIntervals = [];


    dayIntervals.push(
        ...getTimesInterval(day.hairdresser_work_day_ft_starting_time, day.hairdresser_work_day_ft_ending_time, interval)
    )

    if (day.hairdresser_work_day_st_starting_time) {
        dayIntervals.push(
            ...getTimesInterval(day.hairdresser_work_day_st_starting_time, day.hairdresser_work_day_st_ending_time, interval)
        )
    };

    return dayIntervals;
};

const get5DigitRandomNumber = () => {
    const min = 10000;
    const max = 99999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

module.exports = {
    thereAreErrors,
    refreshToken,
    getDayIntervals,
    get5DigitRandomNumber
};