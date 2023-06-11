const executeQuery = require('../utils/executeQuery');

class HairdresserWorkdayModel {

    getHairdressersMinAndMaxWorkingTimePerDay = async (notIn) => {
        const query = `
        SELECT * FROM view_hairdresserminandmaxworkingtimeperday
        ${notIn ? `WHERE work_day_id NOT IN (${new Array(notIn.length).fill("?").join(",")})` : ""}
        `;

        return await executeQuery(query, notIn);
    };



}

module.exports = new HairdresserWorkdayModel();
