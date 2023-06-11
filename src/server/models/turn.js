const executeQuery = require('../utils/executeQuery');
const _ = require('lodash');

class TurnModel {

    states = {
        accepted: 1,
        pending: 2,
        rejected: 3
    };

    getTurns = async (filters) => {


        let sizeFilter = "";
        let typeFilter = "";
        let hairdresserFilter = "";
        let monthFilter = "";
        let yearFilter = "";
        let dayFilter = "";
        let clientFilter = "";

        if (filters.size) sizeFilter = filters.size;
        if (filters.type) typeFilter = `t.turn_state = ${this.states[filters.type]}`;
        if (filters.hairdresser) hairdresserFilter = `t.turn_hairdresser_id = ${filters.hairdresser}`;
        if (filters.month) monthFilter = `MONTH(t.turn_datetime) = ${filters.month}`;
        if (filters.year) yearFilter = `YEAR(t.turn_datetime) = ${filters.year}`;
        if (filters.day) dayFilter = `DAY(t.turn_datetime) = ${filters.day}`;
        if (filters.client) clientFilter = `t.turn_client_id = ${filters.client}`

        const query =
            `
        SELECT ${this._getTurnsColumns(sizeFilter)} 
        FROM turns t 
        LEFT JOIN users h ON h.user_id = t.turn_hairdresser_id
        LEFT JOIN users c ON c.user_id = t.turn_client_id
        ${typeFilter ? "WHERE " : ""}${typeFilter}
        ${hairdresserFilter ? `${typeFilter ? " AND " : "WHERE "} ` : ""}${hairdresserFilter}
        ${monthFilter ? `${typeFilter || hairdresserFilter ? " AND " : "WHERE "}` : ""}${monthFilter}
        ${yearFilter ? `${typeFilter || hairdresserFilter || monthFilter ? " AND " : "WHERE "}` : ""}${yearFilter}
        ${dayFilter ? `${typeFilter || hairdresserFilter || monthFilter || yearFilter ? " AND " : "WHERE "}` : ""}${dayFilter}
        ${clientFilter ? `${typeFilter || hairdresserFilter || monthFilter || yearFilter || dayFilter ? " AND " : "WHERE "}` : ""}${clientFilter}
        ${filters.last ? "ORDER BY t.turn_creation_datetime DESC LIMIT 1" : "ORDER BY t.turn_datetime ASC"
            }
        `


        let turns = executeQuery(query);
        turns = await turns;

        return turns;

    };

    getTurn = async ({
        id,
        size = "all"
    }) => {

        const query = `
        SELECT ${this._getTurnsColumns(size)} 
        FROM turns t 
        LEFT JOIN users h ON h.user_id = t.turn_hairdresser_id
        LEFT JOIN users c ON c.user_id = t.turn_client_id
        WHERE turn_id = ${id}
`

        let turn = executeQuery(query);
        turn = await turn;

        return turn;

    };

    getNextTurn = async (id) => {
        const query = `SELECT
        * 
        FROM 
        turns t 
        ${id !== "general" ? `WHERE t.turn_hairdresser_id = ${id}` : ""}
        ${id === "general" ? "WHERE t.turn_state = 1" : " AND t.turn_state = 1"}
        ORDER BY t.turn_datetime ASC LIMIT 1;`;

        const nextTurn = await executeQuery(query);

        return nextTurn[0];
    };


    getTurnServices = async (id) => {
        const query = `SELECT s.service_id, s.service_name, s.service_cost FROM turns_services ts
        INNER JOIN services s ON s.service_id = ts.service_id
        WHERE ts.turn_id = ${id} `;

        let turnServices = await executeQuery(query);
        turnServices = await turnServices;

        return turnServices;
    };

    getTurnTotalCost = async (id) => {
        const query = `SELECT SUM(s.service_cost) AS total_cost FROM turns_services ts
        INNER JOIN services s ON s.service_id = ts.service_id
        WHERE ts.turn_id = ${id} `;

        const res = await executeQuery(query);
        return res[0].total_cost;

    };

    createTurn = async ({ hairdresser, date, time, observation, client }) => {

        try {

            const query = `INSERT INTO turns (turn_client_id,turn_hairdresser_id,turn_datetime,
                turn_state,turn_client_observation,turn_hairdresser_observation,turn_photo) VALUES (?,?,?,?,?,?,?)`;
            const parameters = [client, hairdresser, `${date} ${time}`, 2, observation ?? null, null, null];
            return await executeQuery(query, parameters);
        }

        catch (err) {
            throw err;
        };

    };

    updateTurnPhoto = async (turnID, filename) => {
        try {

            const query = "UPDATE turns SET turn_photo = ? WHERE turn_id = ?";
            const parameters = [filename, turnID];
            return await executeQuery(query, parameters);
        }

        catch (err) {
            throw err;
        };
    };

    addServicesToTurn = async (turnID, services) => {

        try {

            let values = "";

            for (let i = 0; i < services.length; i++) values += `(${turnID}, ${services[i]})${i === (services.length - 1) ? ";" : ","} `;

            const query = `INSERT INTO turns_services VALUES ${values} `;

            return await executeQuery(query);
        }

        catch (err) {
            throw err;
        };

    };

    updateTurn = async ({
        id,
        state,
        observation
    }) => {

        try {


            const query = `UPDATE turns t SET t.turn_state = ?
                ${observation ? ", t.turn_hairdresser_observation = ?" : ""}
                    WHERE t.turn_id = ?
                `;

            const params = observation ? [this.states[state], observation, id] : [this.states[state], id];

            return await executeQuery(query, params);
        }

        catch (err) {
            throw err;
        };

    };

    deleteTurn = async (id) => {

        try {

            const query = `DELETE FROM turns WHERE turn_id = ${id} `;
            return await executeQuery(query);
        }

        catch (err) {

            throw err;
        };


    };


    /*--------------------------------PRIVATE METHODS-------------------------------------------*/

    _getTurnsColumns = (size) => {

        switch (size) {
            case "reduced":
                return "t.turn_id,c.user_full_name as client_name,h.user_full_name as hairdresser_name,h.user_id as hairdresser_id,t.turn_datetime,t.turn_creation_datetime";
            case "detailed":
                return `t.turn_id, t.turn_datetime, t.turn_state, t.turn_photo, t.turn_hairdresser_observation, t.turn_client_observation, c.user_phone AS client_phone,
    c.user_id AS client_id, c.user_full_name AS client_name, c.user_profile_photo AS client_profile_photo,
        h.user_id AS hairdresser_id, h.user_full_name AS hairdresser_name, h.user_profile_photo AS hairdresser_profile_photo`
            default:
                return "*"
        };

    };

    /*----------------------------------------------------------------------------------------------*/

}




module.exports = new TurnModel();