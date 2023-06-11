const router = require('express').Router()
const {
	verifyToken,
	verifyRegisterFields,
	verifyHairdresserPermission,
	verifyParameters,
	verifyHairdressersActionsAllowed,
	verifyPermissionHandling,
	verifyUserUpdateRequest,
	verifyScheduleFormat
} = require('../middlewares/index');
const controller = require('../controllers/user');
const { ENABLE_PHONE_VERIFICATION } = require('../../constants');


/*CREA UNA SESIÓN AL USUARIO*/
router.post("/login", (req, res, next) => {
	verifyParameters(req, res, next, req.body, {
		mail: { presence: true }, password: { presence: true }
	})
}, controller.login);

/*ELIMINA UNA SESIÓN ACTIVA DE UN USUARIO*/
router.get("/logout", verifyToken, controller.logout);


/*CHEQUEA SI EL USUARIO TIENE UNA SESIÓN ACTIVA*/
router.get("/check", verifyToken, controller.checkSession);

/*OBTIENE TODA LA INFORMACIÓN DE LOS PELUQUEROS*/
router.get("/hairdressers", verifyToken, (req, res, next) => verifyParameters(req, res, next, req.query, {
	onlyEnabledOnes: {
		inclusion: ["true", "false"]
	}
}), controller.getHairdressers);



/*OBTIENE TODA LA INFORMACIÓN DE UN PELUQUERO*/
router.get("/hairdressers/:id", verifyToken, verifyHairdresserPermission, (req, res, next) => {
	verifyParameters(req, res, next, req.params, {
		id: {
			presence: true,
			numericality: true
		}
	})
}, controller.getHairdresser);

/*OBTIENE LOS HORARIOS DE TRABAJO PARA UN PELUQUERO DETERMINADO*/
router.get("/hairdressers/:id/schedule", verifyToken, verifyHairdresserPermission, (req, res, next) => {
	verifyParameters(req, res, next, req.params, {
		id: {
			presence: true,
			numericality: true
		}
	})
}, controller.getHairdresserSchedule);

/*REGISTRO DE PELUQUEROS*/
router.post("/hairdressers", verifyToken, (req, res, next) => {
	verifyHairdresserPermission(req, res, next, true)
}, (req, res, next) => {
	verifyParameters(req, res, next, req.body, {
		mail: {
			presence: true
		},
		phone: {
			presence: true
		},
		username: {
			presence: true /*LOS PRIVILEGIOS SE VALIDAN EN EL MIDDLEWARE verifyPermissionHandling*/
		},
		password: {
			presence: true
		},
		confirmPassword: {
			presence: true
		}
	})
}, (req, res, next) => verifyRegisterFields(req, res, next, true), (req, res, next) => {
	verifyPermissionHandling(req, res, next, true)
}, controller.createHairdresser);

/*MODIFICAR LA INFORMACIÓN RELATIVA AL MISMO USUARIO*/
router.put("/myself", verifyToken, (req, res, next) => verifyUserUpdateRequest(req, res, next, false), controller.updateMyProfile);

/*MODIFICAR LA FOTO DE PERFIL DEL MISMO USUARIO*/
router.post("/myself/profile_photo", verifyToken, controller.updateMyProfilePhoto);

if (ENABLE_PHONE_VERIFICATION) {

	/*ENVIAR CÓDIGO DE VERIFICACIÓN AL TELÉFONO DADO*/
	router.get("/myself/phone/verification_code/:phone", verifyToken, controller.getPhoneVerificationCode);

	/*VERIFICAR CÓDIGO ENVIADO AL TELÉFONO*/ 
	router.put("/myself/phone/verification_code/:code", verifyToken, controller.verifyPhone)
};



/*MODIFICAR LA INFORMACIÓN DE UN PELUQUERO*/
router.put("/hairdressers/:id", verifyToken, verifyHairdresserPermission, (req, res, next) => {
	verifyParameters(req, res, next, req.params, {
		id: {
			presence: true,
			numericality: true
		}
	})
}, (req, res, next) => {
	verifyHairdressersActionsAllowed(req, res, next, req.params.id, true)
}, verifyPermissionHandling, (req, res, next) => verifyUserUpdateRequest(req, res, next, true), controller.updateHairdresser);

/*MODIFICA EL ESTADO DEL PELUQUERO(SI ESTÁ HABILITADO O NO)*/
router.put("/hairdressers/:id/enabled", verifyToken, verifyHairdresserPermission,
	(req, res, next) => verifyParameters(req, res, next, req.params, { id: { presence: true, numericality: true } }),
	(req, res, next) => verifyParameters(req, res, next, req.query, { value: { presence: true, inclusion: ["true", "false"] } }),
	(req, res, next) => verifyHairdressersActionsAllowed(req, res, next, req.params.id, true),
	controller.updateHairdresserState);

/*MODIFICAR LOS HORARIOS DE TRABAJO DE UN PELUQUERO*/
router.put("/hairdressers/:id/schedule", verifyToken, verifyHairdresserPermission, (req, res, next) => {
	verifyParameters(req, res, next, req.params, {
		id: {
			presence: true,
			numericality: true
		}
	})
}, (req, res, next) => {
	verifyHairdressersActionsAllowed(req, res, next, req.params.id, true)
}, verifyScheduleFormat, controller.updateHairdresserSchedule);

/*MODIFICAR LA FOTO DE PERFIL DE UN PELUQUERO*/
router.post("/hairdressers/:id/profile_photo", verifyToken, verifyHairdresserPermission, (req, res, next) => {
	verifyParameters(req, res, next, req.params, {
		id: {
			presence: true,
			numericality: true
		}
	})
}, (req, res, next) => {
	verifyHairdressersActionsAllowed(req, res, next, req.params.id, true)
}, controller.updateHairdresserProfilePhoto);



/*BORRA UN PELUQUERO DADO */
router.delete("/hairdressers/:id", verifyToken, verifyHairdresserPermission, (req, res, next) => {
	verifyParameters(req, res, next, req.params, {
		id: {
			presence: true,
			numericality: true
		}
	})
}, (req, res, next) => {
	verifyHairdressersActionsAllowed(req, res, next, req.params.id, false)
}, controller.deleteHairdresser);

/*REGISTRO DE USUARIOS*/
router.post("/", (req, res, next) => verifyRegisterFields(req, res, next, false), controller.register);

/*VERIFICACIÓN DE MAIL DE USUARIO AL REGISTRARSE*/
router.get("/mail/verification", controller.verifyMail);



module.exports = router;