const executeQuery = require('../utils/executeQuery');

class ParamModel {

    async getParams(params) {

        //const query = `SELECT * FROM params WHERE param_name IN(${new Array(params.length).fill("?").join(",")})`
        //return await executeQuery(query,params);
        const query = "SELECT * FROM params";
        return await executeQuery(query);
    };

    async updateParam(param) {

        try {

            const query = "UPDATE params SET param_value = ? WHERE param_name = ?";
            return await executeQuery(query, param.reverse());

        }

        catch (err) {
            throw err;
        };

    };

    async updateParams(params) {


        try {

            let i = 0;
            const paramsArr = Object.entries(params);

            while (i < paramsArr.length) {

                const param = paramsArr[i];
                await this.updateParam(param);
                i++;

            };

        }

        catch (err) {
            throw err;
        };

    };
}

module.exports = new ParamModel();