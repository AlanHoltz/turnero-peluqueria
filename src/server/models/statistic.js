const executeQuery = require('../utils/executeQuery');

class StatisticModel {

    async getStatistics(hairdresser, time) {

        let statistics = await executeQuery(this._getStatisticsQuery(hairdresser, time));

        if (time === "monthly") statistics = statistics[0];


        if (!statistics) {

            statistics = {};

            if (time === "monthly") {

                if (hairdresser !== "general") {
                    statistics["hairdresser_id"] = parseInt(hairdresser);
                };

                statistics = {
                    ...statistics,
                    "month": 7,
                    "year": 2022,
                    "accepted_turns_total": 0,
                    "rejected_turns_total": 0,
                    "average_accepted_turns": 0,
                    "average_rejected_turns": 0,
                    "total_earnings": 0,
                };
            };


        };


        return statistics;

    }

    _getStatisticsQuery(hairdresser, time) {
        const currentDate = new Date();

        return `SELECT
        ${hairdresser !== "general" ? "s.hairdresser_id," : ""}
        s.month,s.year,
        ${hairdresser !== "general" && time === "monthly" ?

                `s.accepted_turns AS accepted_turns_total,
                s.rejected_turns AS rejected_turns_total,
                s.accepted_turns/(s.accepted_turns + s.rejected_turns) * 100 AS average_accepted_turns,
                s.rejected_turns/(s.accepted_turns + s.rejected_turns) * 100 AS average_rejected_turns,
                s.earnings AS total_earnings `
                :
                `SUM(s.accepted_turns) AS accepted_turns_total,
        SUM(s.rejected_turns) AS rejected_turns_total,
        SUM(s.accepted_turns)/ SUM(s.accepted_turns + s.rejected_turns) * 100 AS average_accepted_turns,
        SUM(s.rejected_turns)/ SUM(s.accepted_turns + s.rejected_turns) * 100 AS average_rejected_turns,
        SUM(s.earnings) AS total_earnings `}
        FROM statistics s

        WHERE ${time === "monthly" ? `s.month = ${currentDate.getMonth() + 1} AND s.year = ${currentDate.getFullYear()}` : `s.year = ${time}`}
        ${hairdresser !== "general" ? ` AND s.hairdresser_id = ${hairdresser}` : ``}
        
        ${time !== "monthly" ? `GROUP BY s.month ${hairdresser !== "general" ? ",s.hairdresser_id" : ""}` : ""}
        `;
    };

    async getSpecificStatistics(id) {
        return await executeQuery(`SELECT * FROM statistics s WHERE s.hairdresser_id = ${id.hairdresser} AND s.month = ${id.month} AND s.year = ${id.year}`);
    };

    async createStatistics(id) {

        try {

            return await executeQuery(`
            INSERT INTO statistics
            VALUES (${id.month},${id.year},0,0,0,${id.hairdresser})`);
        }

        catch (err) {
            throw err;
        };

    };

    async updateStatistics(id, changes) {

        try {

            let statisticsExist = await this.getSpecificStatistics(id);
            statisticsExist = statisticsExist.length > 0;

            if (!statisticsExist) await this.createStatistics(id);

            let changesStrings = Object.entries(changes).map(entrie => `${entrie[0]}=${entrie[1]}`);
            changesStrings = changesStrings.join(",");

            const query = `UPDATE statistics SET ${changesStrings} WHERE hairdresser_id = ${id.hairdresser} AND month = ${id.month} AND year = ${id.year}`;
            return await executeQuery(query);
        }

        catch (err) {
            throw err;
        };


    };



};

/*#MENSUAL GENERAL
SELECT
s.month,
s.year,
SUM(s.accepted_turns) AS accepted_turns_total,
SUM(s.rejected_turns) AS rejected_turns_total,
SUM(s.accepted_turns)/ SUM(s.accepted_turns + s.rejected_turns) * 100 AS average_accepted_turns,
SUM(s.rejected_turns)/ SUM(s.accepted_turns + s.rejected_turns) * 100 AS average_rejected_turns,
SUM(s.earnings) AS total_earnings 
FROM statistics s
WHERE s.month = 6 AND s.year = 2022;

#MENSUAL PARTICULAR
SELECT
s.hairdresser_id,
s.month,
s.year,
s.accepted_turns AS accepted_turns_total,
s.rejected_turns AS rejected_turns_total,
s.accepted_turns/(s.accepted_turns + s.rejected_turns) * 100 AS average_accepted_turns,
s.rejected_turns/(s.accepted_turns + s.rejected_turns) * 100 AS average_rejected_turns,
s.earnings AS total_earnings 
FROM statistics s
WHERE s.month = 6 AND s.year = 2022 AND s.hairdresser_id = 1;

#HISTÓRICO GENERAL
SELECT
s.month,
s.year,
SUM(s.accepted_turns) AS accepted_turns_total,
SUM(s.rejected_turns) AS rejected_turns_total,
SUM(s.accepted_turns)/ SUM(s.accepted_turns + s.rejected_turns) * 100 AS average_accepted_turns,
SUM(s.rejected_turns)/ SUM(s.accepted_turns + s.rejected_turns) * 100 AS average_rejected_turns,
SUM(s.earnings) AS total_earnings 
FROM statistics s
WHERE s.year = 2022
GROUP BY s.month;


#HISTÓRICO PARTICULAR
SELECT
s.hairdresser_id,
s.month,
s.year,
SUM(s.accepted_turns) AS accepted_turns_total,
SUM(s.rejected_turns) AS rejected_turns_total,
SUM(s.accepted_turns)/ SUM(s.accepted_turns + s.rejected_turns) * 100 AS average_accepted_turns,
SUM(s.rejected_turns)/ SUM(s.accepted_turns + s.rejected_turns) * 100 AS average_rejected_turns,
SUM(s.earnings) AS total_earnings 
FROM statistics s
WHERE s.year = 2022 AND s.hairdresser_id = 1
GROUP BY s.month, s.hairdresser_id;
*/
module.exports = new StatisticModel();