const router = require('express').Router();
const { verifyToken, verifyHairdresserPermission, verifyParameters, verifyService } = require('../middlewares/index');
const controller = require('../controllers/service');

router.get("/", verifyToken, controller.getServices);




router.post("/", verifyToken, (req, res, next) => verifyHairdresserPermission(req, res, next, false, true),
    verifyService, controller.createService);





router.put("/:id", verifyToken, (req, res, next) => verifyHairdresserPermission(req, res, next, false, true),
    (req, res, next) => verifyParameters(req, res, next, req.params, { id: { presence: true, numericality: true } }),
    (req, res, next) => verifyService(req, res, next, true), controller.updateService);



router.delete("/:id", verifyToken, (req, res, next) => verifyHairdresserPermission(req, res, next, false, true),
    (req, res, next) => verifyParameters(req, res, next, req.params, { id: { presence: true, numericality: true } }),
    (req, res, next) => verifyService(req, res, next, false, true), controller.deleteService);



router.put("/:id/photo", verifyToken, (req, res, next) => verifyHairdresserPermission(req, res, next, false, true),
    (req, res, next) => verifyParameters(req, res, next, req.params, { id: { presence: true, numericality: true } }),
    (req, res, next) => verifyService(req, res, next, false, true), controller.updateServicePhoto);



module.exports = router;