const { Param } = require('../models/index');
const logger = require('../log');

class ParamController {

    async getParams(req, res) {

        const resp = await Param.getParams();
        return res.send(resp);
    };



    async updateParams(req, res) {

        try {


            await Param.updateParams(req.query);
            res.send({ updated: true });
            logger.info(req, `Params have been updated`);
        }

        catch (e) {
            res.status(500).send({ error: e.toString() });
            logger.error(req, e);
        };
    };
};

module.exports = new ParamController();