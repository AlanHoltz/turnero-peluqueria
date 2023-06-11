const executeQuery = require('../utils/executeQuery');
const moment = require('moment');
const _ = require('lodash');

class FreeDayModel {

    async getOne(id) {

        const query = "SELECT * FROM free_days WHERE free_day_id = ?";
        return await executeQuery(query, [id]);

    };

    async getAll() {

        const query = "SELECT * FROM free_days";
        return await executeQuery(query);
    };

    async getAllEdges(date) {

        const query = `SELECT * FROM free_days fd 
        WHERE ? = DATE(fd.free_day_starting_timestamp)
        OR
        ? = DATE(fd.free_day_ending_timestamp)
        UNION
        SELECT * FROM free_days fd
        WHERE (MONTH(?) = MONTH(fd.free_day_starting_timestamp) AND DAY(?) = DAY(fd.free_day_starting_timestamp) )
        OR (MONTH(?) = MONTH(fd.free_day_ending_timestamp) AND DAY(?) = DAY(fd.free_day_ending_timestamp))
        AND fd.free_day_frequency = 'anual';`
        return await executeQuery(query, new Array(6).fill(date));
    };

    async getAllByMonthAndYear({ month, year }) {
        const query = `(SELECT * FROM free_days fd WHERE 
            (MONTH(fd.free_day_starting_timestamp) = ? AND YEAR(fd.free_day_starting_timestamp) = ?)
            OR 
            (MONTH(fd.free_day_ending_timestamp) = ? AND YEAR(fd.free_day_ending_timestamp) = ?)
            )
            UNION
            (SELECT * FROM free_days fd WHERE
            ((MONTH(fd.free_day_starting_timestamp) = ? OR MONTH(fd.free_day_ending_timestamp) = ?) AND free_day_frequency = "anual")
            )`;

        return await executeQuery(query, [month, year, month, year, month, month]);
    };

    async createFreeDay(freeDay) {

        try {

            const query = "INSERT INTO free_days VALUES (null,?,?,?,?)";
            const parameters = [freeDay.free_day_description, moment(freeDay.free_day_starting_timestamp).format("YYYY-MM-DD HH:mm"),
            moment(freeDay.free_day_ending_timestamp).format("YYYY-MM-DD HH:mm"), freeDay.free_day_frequency]

            return await executeQuery(query, parameters);

        }
        catch (err) {
            throw err;
        };

    };

    async updateFreeDay(freeDay) {

        try {

            const query = `UPDATE free_days SET free_day_description = ?, 
            free_day_starting_timestamp = ?, 
            free_day_ending_timestamp = ?, 
            free_day_frequency = ? WHERE free_day_id = ?`
            const parameters = [freeDay.free_day_description, moment(freeDay.free_day_starting_timestamp).format("YYYY-MM-DD HH:mm"),
            moment(freeDay.free_day_ending_timestamp).format("YYYY-MM-DD HH:mm"), freeDay.free_day_frequency, freeDay.id]
            return await executeQuery(query, parameters);
        }

        catch (err) {
            throw err;
        };
    };

    async deleteFreeDay(id) {
        try {

            const query = `DELETE FROM free_days WHERE free_day_id = ?`
            const parameters = [id]
            return await executeQuery(query, parameters);
        }

        catch (err) {
            throw err;
        };
    };

};


module.exports = new FreeDayModel();