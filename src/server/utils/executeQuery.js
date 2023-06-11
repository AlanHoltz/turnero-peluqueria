const db = require('../db');


const executeQuery = (query, parameters = null) => {
    return new Promise((res, rej) => {
        db.query(query, parameters, (err, data) => {
            if (err) rej(err);
            res(data);
        });
    });

}


module.exports = executeQuery;