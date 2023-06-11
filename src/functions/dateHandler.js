const moment = require('moment');


const getFormattedDate = (date, format = undefined) => {

    return moment(date).format(format ? format : `DD/MM/YYYY - HH:mm`);

};

const getParsedDate = (date) => {
    return moment(date).utc().format();
};

const getParsedTime = (time, sufix = true) => {

    const servicioMinutos = time / 1000 / 60;
    if (servicioMinutos > 59) return `${Math.floor((servicioMinutos / 60) * 100) / 100}${sufix ? "h" : ""}`;
    if (servicioMinutos < 1) return "";
    return `${Math.floor(servicioMinutos)}${sufix ? "m" : ""}`;
};

const getDifference = (dateOne, dateTwo, unit = "minutes") => {
    const parsedDateOne = moment(getParsedDate(dateOne));
    const parsedDateTwo = moment(getParsedDate(dateTwo));

    return moment(parsedDateOne).diff(parsedDateTwo, unit);
}


const getCalendarDate = (date) => {
    return moment(getParsedDate(date)).calendar({
        sameDay: '[Hoy]',
        nextDay: '[Mañana]',
        lastDay: '[Ayer]',
        sameElse: 'DD/MM/YYYY',
        lastWeek: 'DD/MM/YYYY',
        nextWeek: 'DD/MM/YYYY',

    });
};

const isSameDay = (dateOne, dateTwo) => {

    const d1 = getParsedDate(dateOne);
    const d2 = getParsedDate(dateTwo);

    return moment(d1).isSame(d2, 'day');
};

const getTimesInterval = (starting, ending, interval = 30) => {


    let timeIntervals = []

    let currentInterval = moment(`2022-03-29 ${starting}`);
    ending = moment(`2022-03-29 ${ending}`);

    while (currentInterval.isBefore(ending)) {

        timeIntervals.push(moment(currentInterval).format("HH:mm"));
        currentInterval = currentInterval.add(interval, "minute");
    };

    return timeIntervals;


};

const getDatesInterval = (starting, ending, interval = 1) => {

    let dateIntervals = []

    let currentInterval = moment(`${starting}`);
    ending = moment(`${ending}`);

    while (currentInterval.isBefore(ending)) {

        dateIntervals.push(moment(currentInterval).format("YYYY-MM-DD"));
        currentInterval = currentInterval.add(interval, "day");
    };

    return dateIntervals;
};

module.exports = {

    getFormattedDate,
    getParsedDate,
    getCalendarDate,
    isSameDay,
    getDifference,
    getParsedTime,
    getTimesInterval,
    getDatesInterval

};