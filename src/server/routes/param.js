const router = require('express').Router();
const { verifyToken, verifyHairdresserPermission, verifyTurnsParams } = require('../middlewares');
const controller = require('../controllers/param');

router.get("/", verifyToken, controller.getParams)



router.put("/", verifyToken, (req, res, next) => verifyHairdresserPermission(req, res, next, true),
    verifyTurnsParams, controller.updateParams)


    
module.exports = router;