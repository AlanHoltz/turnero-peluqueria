const router = require('express').Router();
const { verifyToken, verifyHairdresserPermission, verifyHairdressersActionsAllowed, verifyStatistics } = require('../middlewares/index');
const controller = require('../controllers/statistic');

router.get("/:user_or_general/:time", verifyToken, verifyHairdresserPermission, verifyStatistics, (req, res, next) => {
    if (req.params.user_or_general === "general") {
        next();
    } else {
        return verifyHairdressersActionsAllowed(req, res, next, req.params.user_or_general, true);
    };
},
    controller.getStatistics);

module.exports = router;