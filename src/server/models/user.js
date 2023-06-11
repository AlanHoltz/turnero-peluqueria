const executeQuery = require('../utils/executeQuery');
const _ = require('lodash');
const moment = require('moment');
const { async } = require('validate.js');

class UserModel {

    getOneByMail = async (mail) => {

        const query = `SELECT u.user_id,u.user_mail,u.user_password,u.user_full_name,u.user_phone,u.user_profile_photo,h.hairdresser_privilege_id 
        FROM users u 
        LEFT JOIN hairdressers h ON u.user_id = h.hairdresser_id 
        WHERE user_mail = ?`

        const parameters = [mail];

        const userData = await executeQuery(query, parameters);

        return userData[0];


    };

    mailAlreadyExists = async (mail) => {
        const query = "SELECT * FROM users WHERE user_mail = ?";
        const parameters = [mail];

        const userData = await executeQuery(query, parameters);

        return userData.length > 0;
    };

    register = async ({
        mail,
        phone,
        username,
        password,
    }) => {

        try {

            const query =
                `INSERT INTO users (user_mail,user_phone,user_full_name,user_password)
            VALUES (?,?,?,?)
            `;

            const parameters = [mail, phone, username, password];

            return await executeQuery(query, parameters);
        }

        catch (err) {
            throw err;
        };

    };

    userChangeMailToken = async (id, token) => {

        try {

            const query = `UPDATE users SET user_mail_token = ? WHERE user_id = ?`;
            const parameters = [token, id];
            return await executeQuery(query, parameters);
        }

        catch (err) {
            throw err;
        };

    };

    hairdresserRegister = async ({
        mail,
        phone,
        username,
        password,
        hairdresser_privilege_id
    }) => {

        try {


            const generatedValues = await this.register({
                mail,
                phone,
                username,
                password,
                mailToken: null
            });

            const query = `INSERT INTO hairdressers VALUES (?,?, ?)`;
            const parameters = [generatedValues.insertId, hairdresser_privilege_id, 1];

            await executeQuery(query, parameters);

            await this.hairdresserRegisterWorkDays(generatedValues.insertId);

            return generatedValues.insertId;
        }

        catch (err) {
            throw err;
        };

    };

    hairdresserRegisterWorkDays = async (id) => {

        try {


            let values = "";

            for (let workDay = 1; workDay <= 7; workDay++) values += `(${id},${workDay},null,null,null,null)${workDay === 7 ? ";" : ","}`;

            const query = `INSERT INTO hairdresser_work_days VALUES ${values}`;

            await executeQuery(query);
        }

        catch (err) {
            throw err;
        };
    };

    getMailToken = async (mail) => {
        const query = `SELECT user_mail_token FROM users WHERE user_mail = ?`;
        const parameters = [mail];

        let token = await executeQuery(query, parameters);
        token = token[0];


        return token ? token.user_mail_token : null;

    };

    verifyMail = async (mail) => {

        try {

            const query = "UPDATE users SET user_mail_token = ? WHERE user_mail = ?";
            const parameters = [null, mail];
            await executeQuery(query, parameters);
        }

        catch (err) {
            throw err;
        };

    };

    getHairdressers = async (includePrivileges, includeDisabled = true) => {
        const query = `SELECT u.user_id,u.user_full_name, h.hairdresser_enabled ,u.user_profile_photo${includePrivileges ? ",h.hairdresser_privilege_id" : ""} FROM users u
        INNER JOIN hairdressers h
        ON u.user_id = h.hairdresser_id
        ${includeDisabled ? "WHERE hairdresser_enabled = 1" : ""}
        `;

        let hairdressers = executeQuery(query);
        hairdressers = await hairdressers;

        return hairdressers;

    };

    getHairdressersAmount = async () => {
        const hairdressersAmountQuery = await executeQuery("SELECT COUNT(*) FROM hairdressers");
        return hairdressersAmountQuery[0]["COUNT(*)"];
    };


    getHairdresser = async (id) => {
        const query = `SELECT u.user_id,u.user_full_name, u.user_profile_photo, u.user_phone, u.user_mail,u.user_profile_photo ,h.hairdresser_privilege_id,h.hairdresser_enabled FROM users u
        INNER JOIN hairdressers h
        ON u.user_id = h.hairdresser_id
        WHERE h.hairdresser_id= ?`;

        const params = [id]
        let hairdresser = executeQuery(query, params);
        hairdresser = await hairdresser;

        return hairdresser[0];

    };

    getHairdresserSchedule = async (id, day = null) => {
        const query = `SELECT 
        wd.work_day_id,wd.work_day_name,
        DATE_FORMAT(hwd.hairdresser_work_day_ft_starting_time,'%H:%i') AS hairdresser_work_day_ft_starting_time,
        DATE_FORMAT(hwd.hairdresser_work_day_ft_ending_time,'%H:%i') AS hairdresser_work_day_ft_ending_time,
        DATE_FORMAT(hwd.hairdresser_work_day_st_starting_time,'%H:%i') AS hairdresser_work_day_st_starting_time,
        DATE_FORMAT(hwd.hairdresser_work_day_st_ending_time,'%H:%i') AS hairdresser_work_day_st_ending_time
        FROM hairdresser_work_days hwd
        INNER JOIN work_days wd ON wd.work_day_id = hwd.work_day_id
        WHERE hwd.hairdresser_id = ? ${day ? "AND wd.work_day_id = ?" : ""}`

        const params = [id, day];

        const req = await executeQuery(query, params);

        if (day) return req[0];
        return req;

    };


    deleteUser = async (id) => {
        try {

            const query = "DELETE FROM users WHERE user_id = ?";
            const params = [id];
            await executeQuery(query, params);
        }

        catch (err) {
            throw err;
        };
    };

    updateUser = async (fields) => {

        try {

            let parameters = [];
            let mainQuery = `UPDATE users SET `;
            let executeMainQuery = false;

            const ID = fields.id;
            let fieldsWithoutIdAndPrivilege = {
                /*EL ID Y LOS PRIVILEGIOS SE MANEJAN APARTE*/
                ...fields
            };
            delete fieldsWithoutIdAndPrivilege.id;
            delete fieldsWithoutIdAndPrivilege.hairdresser_privilege_id;


            const fieldsArray = _.toPairs(fieldsWithoutIdAndPrivilege);


            fieldsArray.forEach((field, index) => {

                const fieldName = field[0];

                switch (fieldName) {
                    case "mail":
                        mainQuery += `user_mail = ?${fieldsArray[index + 1] ? "," : ""}`;
                        parameters.push(field[1]);
                        executeMainQuery = true;
                        break;
                    case "phone":
                        mainQuery += `user_phone = ?${fieldsArray[index + 1] ? "," : ""}`;
                        parameters.push(field[1]);
                        executeMainQuery = true;
                        break;
                    case "username":
                        mainQuery += `user_full_name = ?${fieldsArray[index + 1] ? "," : ""}`;
                        parameters.push(field[1]);
                        executeMainQuery = true;
                        break;
                    case "password":
                        mainQuery += `user_password = ?${fieldsArray[index + 1] ? "," : ""}`;
                        parameters.push(field[1]);
                        executeMainQuery = true;
                        break;

                    default:
                        break;
                }
            });

            mainQuery += " WHERE user_id = ?";
            parameters.push(ID);


            if (fields.hairdresser_privilege_id) {
                await executeQuery(`UPDATE hairdressers SET hairdresser_privilege_id = ? WHERE hairdresser_id = ?`, [fields.hairdresser_privilege_id, ID]);
            };

            if (executeMainQuery) await executeQuery(mainQuery, parameters);
        }

        catch (err) {
            throw err;
        };


    };

    updateProfilePhoto = async (userID, filename) => {

        try {

            const query = "UPDATE users SET user_profile_photo = ? WHERE user_id = ?";
            const parameters = [filename, userID];
            await executeQuery(query, parameters);
        }

        catch (err) {
            throw err;
        };

    };

    updateHairdresserSchedule = async (id, schedule) => {

        let index = 0;

        while (index < schedule.length) {

            const day = schedule[index];

            const query = `
            UPDATE hairdresser_work_days SET 
            hairdresser_work_day_ft_starting_time = ?,
            hairdresser_work_day_ft_ending_time = ?,
            hairdresser_work_day_st_starting_time = ?,
            hairdresser_work_day_st_ending_time = ?
            WHERE hairdresser_id = ? AND work_day_id = ?
        `

            const parameters = [
                day.firstTurn ? day.firstTurn[0] : null,
                day.firstTurn ? day.firstTurn[1] : null,
                day.secondTurn ? day.secondTurn[0] : null,
                day.secondTurn ? day.secondTurn[1] : null,
                id,
                index + 1];

            await executeQuery(query, parameters);

            index++;
        };
    };

    /*getHairdresserSchedule = async (id) => {
        return await executeQuery("SELECT * FROM hairdresser_work_days WHERE hairdresser_id = ?", [id]);
    };*/

    updateHairdresserEnabled = async (id, enabled) => {
        try {

            return await executeQuery(`UPDATE hairdressers SET hairdresser_enabled = ? WHERE hairdresser_id = ?`, [enabled, id])
        }

        catch (err) {
            throw err;
        };
    };

    updatePhoneVerificationCode = async (userId, verificationCode) => {
        try {

            let expiration = moment().add(15, "minute");
            expiration = expiration.format("YYYY-MM-DD HH:mm:ss")

            return await executeQuery(`UPDATE users SET user_phone = NULL,user_phone_verification_code = ?,
            user_phone_verification_code_expiration = ? WHERE user_id = ?`, [verificationCode, expiration, userId])
        }

        catch (err) {
            throw err;
        };
    }


    updatePhone = async (userId, phone) => {
        try {

            return await executeQuery(`UPDATE users SET user_phone = ?,user_phone_verification_code = NULL,
            user_phone_verification_code_expiration = NULL WHERE user_id = ?
            `, [phone, userId])

        } catch (err) {
            throw err;
        };
    };

    getUserPhoneData = async (userId) => {

        const user_verification_code = await executeQuery(`SELECT user_phone,user_phone_verification_code,
        user_phone_verification_code_expiration FROM users WHERE user_id = ?`, [userId])
        return user_verification_code[0];
    };

}

module.exports = new UserModel();