const { Service } = require('../models/index');
const fileHandler = require('../utils/fileHandler');
const logger = require('../log');

class ServiceController {

    async getServices(req, res) {

        res.send(await Service.getServices());
    };


    async createService(req, res) {

        try {
            const resp = await Service.createService({ ...req.body });
            res.send({ created: resp.insertId });
            logger.info(req, `Service \"${req.body.serviceName}\" has been created`);
        }


        catch (e) {
            res.status(500).send({ error: e.toString() });
            logger.error(req, e);
        };
    };


    async updateService(req, res) {

        try {

            await Service.updateService({ ...req.body, serviceID: req.params.id });
            res.send({ updated: true });
            logger.info(req, `Service with ID: ${req.params.id} has been updated`);

        }

        catch (e) {
            res.status(500).send({ error: e.toString() });
            logger.error(req, e);
        };
    };


    async deleteService(req, res) {

        try {

            await Service.deleteService(req.params.id);
            await fileHandler.deleteAllDirectoryFiles(`./media/services_photos/${req.params.id}`);
            await fileHandler.deleteDirectory(`./media/services_photos/${req.params.id}`);
            res.send({ deleted: true });
            logger.info(req, `Service with ID: ${req.params.id} has been deleted`);
        }

        catch (e) {
            res.status(500).send({ error: e.toString() });
            logger.error(req, e);
        };
    };


    async updateServicePhoto(req, res) {


        const uploadFile = {
            mainFolder: "services_photos",
            customizedFolder: req.params.id.toString(),
            req: req,

        };

        fileHandler.upload(uploadFile, async (err, randomFilename) => {

            try {

                if (err) return res.status(400).send({ error: err });

                await Service.updateServicePhoto(req.params.id, randomFilename);

                res.send({
                    updated: true
                });

                logger.info(req, `Service with ID: ${req.params.id} photo has been updated`);
            }

            catch (e) {
                res.status(500).send({ error: e.toString() });
                logger.error(req, e);
            };

        });
    };
};

module.exports = new ServiceController();