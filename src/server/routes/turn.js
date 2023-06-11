const router = require('express').Router();
const {
    verifyToken,
    verifyHairdresserPermission,
    verifyParameters,
    verifyTurn
} = require('../middlewares/index');
const controller = require('../controllers/turn');

/*OBTIENE TODOS LOS TURNOS*/
router.get("/", verifyToken, verifyHairdresserPermission, (req, res, next) => {
    verifyParameters(req, res, next, req.query, {
        type: {
            inclusion: ["accepted", "pending", "rejected"]
        },
        size: {
            inclusion: ["reduced", "all", "detailed"]
        },
        hairdresser: {
            numericality: true
        },
    })
}, controller.getTurns);



router.get("/unavailable-dates", verifyToken, (req, res, next) => verifyParameters(req, res, next, req.query, {
    hairdresser: {
        presence: true,
    },
    month: {
        presence: true,
        numericality: true
    },
    year: {
        presence: true,
        numericality: true
    }
}), controller.getUnavailableDates);

router.get("/availables", verifyToken, (req, res, next) => verifyParameters(req, res, next, req.query, {
    hairdresser: { presence: true },
    date: { presence: true }
}), controller.getAvailableTimes);



/*OBTIENE (SI ES QUE TIENE) EL ÚLTIMO TURNO PARA EL USUARIO QUE MANDA LA PETICIÓN*/
router.get("/mine", verifyToken, controller.getMyTurn);



/*OBTIENE UN TURNO DADO SU ID*/
router.get("/:id", verifyToken, verifyHairdresserPermission, (req, res, next) => {
    verifyParameters(req, res, next, req.params, {
        id: {
            presence: true,
            numericality: true
        }
    })
}, (req, res, next) => {
    verifyParameters(req, res, next, req.query, {
        size: {
            inclusion: ["all", "detailed", "reduced"]
        }
    })
}, controller.getTurnByID);



router.get("/next/:user", verifyToken, verifyHairdresserPermission, controller.getHairdresserNextTurn);



/*OBTIENE TODOS LOS SERVICIOS DE UN TURNO DADO SU ID*/
router.get("/:id/services", verifyToken, verifyHairdresserPermission, (req, res, next) => {
    verifyParameters(req, res, next, req.params, {
        id: {
            presence: true,
            numericality: true
        }
    })
}, controller.getTurnServices);



/*CREAR UN NUEVO TURNO*/
router.post("/", verifyToken, verifyTurn, controller.createTurn);



router.put("/:id/photo", verifyToken, (req, res, next) => {
    verifyParameters(req, res, next, req.params, {
        id: {
            presence: true,
            numericality: true
        }
    })
}, (req, res, next) => verifyTurn(req, res, next, true), controller.updateTurnPhoto);



/*MODIFICAR UN TURNO DADO SU ID*/
router.put("/:id", verifyToken, verifyHairdresserPermission, (req, res, next) => {
    verifyParameters(req, res, next, req.params, {
        id: {
            presence: true,
            numericality: true
        }
    })
}, controller.updateTurn);



/*BORRAR UN TURNO DADO SU ID*/
router.delete("/:id", verifyToken, verifyHairdresserPermission, (req, res, next) => {
    verifyParameters(req, res, next, req.params, {
        id: {
            presence: true,
            numericality: true
        }
    })
}, controller.deleteTurn);


module.exports = router;