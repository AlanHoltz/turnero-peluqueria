const router = require('express').Router();
const { verifyToken, verifyHairdresserPermission, verifyFreeDay } = require('../middlewares/index');
const controller = require('../controllers/free-day');

router.get("/", verifyToken, verifyHairdresserPermission, controller.getFreeDays);



router.post("/", verifyToken, (req, res, next) => verifyHairdresserPermission(req, res, next, false, true),
    verifyFreeDay, controller.createFreeDay)



router.put("/:id", verifyToken, (req, res, next) => verifyHairdresserPermission(req, res, next, false, true),
    (req, res, next) => verifyFreeDay(req, res, next, true), controller.updateFreeDay);



router.delete("/:id", verifyToken, (req, res, next) => verifyHairdresserPermission(req, res, next, false, true),
    (req, res, next) => verifyFreeDay(req, res, next, true, true), controller.deleteFreeDay);


    
module.exports = router;