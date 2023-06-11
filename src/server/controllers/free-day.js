const { FreeDay } = require('../models/index');
const logger = require('../log');

class FreeDayController {

    async getFreeDays(req, res) {

        const freeDays = await FreeDay.getAll();
        return res.send(freeDays);

    };



    async createFreeDay(req, res) {

        try {

            await FreeDay.createFreeDay(req.body);
            res.send({ created: true });
            logger.info(req, `Free Day \"${req.body.free_day_description}\" has been created`);
        }

        catch (e) {
            res.status(500).send({ error: e.toString() });
            logger.error(req, e);
        };
    };



    async updateFreeDay(req, res) {

        try {

            await FreeDay.updateFreeDay({ ...req.body, id: req.params.id });
            res.send({ updated: true });
            logger.info(req, `Free Day with ID: ${req.params.id} has been updated`);
        }

        catch (e) {
            res.status(500).send({ error: e.toString() });
            logger.error(req, e);
        };
    };



    async deleteFreeDay(req, res) {

        try {

            await FreeDay.deleteFreeDay(req.params.id);
            res.send({ deleted: true });
            logger.info(req, `Free Day with ID: ${req.params.id} has been deleted`);
        }

        catch (e) {

            res.status(500).send({ error: e.toString() });
            logger.error(req, e);
        };
    };

}

module.exports = new FreeDayController();