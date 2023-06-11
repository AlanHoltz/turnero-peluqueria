const { hairdresserWorkDayModel } = require('./index');
const executeQuery = require('../utils/executeQuery');


class WorkdayModel {

    refreshWorkDays = async (schedule) => {

        let i = 0;

        while (i < schedule.length) {

            const day = schedule[i];

            const query = `
            UPDATE work_days SET work_day_opening_time = ?,
            work_day_closing_time = ?,
            work_day_is_open = ?
            WHERE work_day_id = ?
        `;

            const params = [
                day.starting_time,
                day.ending_time,
                day.starting_time === null ? false : true,
                day.work_day_id
            ];

            await executeQuery(query, params);

            i++;
        };

    };


}

module.exports = new WorkdayModel();