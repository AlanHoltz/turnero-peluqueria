const { User, Workday, HairdresserWorkday } = require('../models/index');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const logger = require('../log');
const {
	JWT_COOKIE_NAME,
	ENABLE_EMAIL_VERIFICATION,
	HAIRDRESSING_NAME,
	MAIL_SECOND_COLOR,
	MAIL_MAIN_COLOR,
	FACEBOOK_URL_BASE,
} = require('../../constants');
const sendVerificationMail = require('../utils/sendVerificationMail');
const {
	getRootPath
} = require('../../functions/getRootPath');
const validator = require('validator');
const _ = require('lodash');
const fileHandler = require('../utils/fileHandler');
const {
	refreshToken,
	get5DigitRandomNumber
} = require('../utils/functions');
const aes256 = require('aes256');
const axios = require('axios').default
const moment = require('moment');

class UserController {

	async login(req, res) {

		try {

			const mail = req.body.mail.toString();
			const password = req.body.password.toString();

			const userData = await User.getOneByMail(mail)
			const decryptedPassword = userData ? aes256.decrypt(process.env.ENCRYPTION_KEY, userData.user_password) : "";


			if (userData && password === decryptedPassword) {
				/*SI EL USUARIO EXISTE DEBE VERIFICAR QUE EL MAIL ESTÉ COMPROBADO ANTES DE LOGUEARSE*/
				if (ENABLE_EMAIL_VERIFICATION) {
					let mailIsVerified = await User.getMailToken(mail);
					mailIsVerified = mailIsVerified === null;
					if (!mailIsVerified) return res.send({
						error: "Su mail no ha sido verificado"
					});
				};




				const JWT_TOKEN = jwt.sign({
					...userData
				}, process.env.JWT_TOKEN, {
					expiresIn: "1d"
				});
				res.cookie(JWT_COOKIE_NAME, JWT_TOKEN, {
					httpOnly: true,
					maxAge: 1000 * 60 * 60 * 24,
				});

				logger.info(req, `${userData.user_full_name}(ID: ${userData.user_id}) successfully logged`);

				return res.send({
					isLogged: true
				});

			};

			res.send({
				isLogged: false
			});

		} catch (e) {
			res.status(500).send({ error: e.toString() });
			logger.error(req, e);

		}
	};

	async logout(req, res) {
		res.clearCookie(JWT_COOKIE_NAME);
		res.send({
			logout: true
		});
	};

	async checkSession(req, res) {

		res.send({
			isLogged: true,
			user: {
				...req.decodedJwt
			}
		});

	};

	async getHairdressers(req, res) {
		res.send(await User.getHairdressers(req.decodedJwt.hairdresser_privilege_id !== null, req.query.onlyEnabledOnes === "true"));
	};

	async getHairdresser(req, res) {
		res.send(await User.getHairdresser(req.params.id));
	};

	async getHairdresserSchedule(req, res) {

		const hairdresserSchedule = await User.getHairdresserSchedule(req.params.id);


		res.send(hairdresserSchedule.map(dayData => {
			const firstTurnStarting = dayData.hairdresser_work_day_ft_starting_time;
			const firstTurnEnding = dayData.hairdresser_work_day_ft_ending_time;
			const secondTurnStarting = dayData.hairdresser_work_day_st_starting_time;
			const secondTurnEnding = dayData.hairdresser_work_day_st_ending_time;


			return {
				day: dayData.work_day_name,
				firstTurn: firstTurnStarting && firstTurnEnding ? [firstTurnStarting, firstTurnEnding] : null,
				secondTurn: secondTurnStarting && secondTurnEnding ? [secondTurnStarting, secondTurnEnding] : null
			}
		}));
	};

	async createHairdresser(req, res) {
		try {

			req.body.password = aes256.encrypt(process.env.ENCRYPTION_KEY, req.body.password);
			const id = await User.hairdresserRegister(req.body);

			logger.info(req, `${req.body.username}(ID: ${id}) has been registered as hairdresser`);

			res.send({
				created: id
			});


		}

		catch (e) {
			res.status(500).send({ error: e.toString() });
			logger.error(req, e);
		};
	};

	async updateMyProfile(req, res) {
		try {

			let updatedData = {
				...req.body,
				id: parseInt(req.decodedJwt.user_id),

			};


			if (req.body.password) {
				updatedData["password"] = aes256.encrypt(process.env.ENCRYPTION_KEY, req.body.password);
			};

			await User.updateUser(updatedData);

			if (req.body.mail && req.body.mail !== req.decodedJwt.user_mail) {
				const mailToken = crypto.randomBytes(16).toString("hex");
				await User.userChangeMailToken(req.decodedJwt.user_id, mailToken);
				if (ENABLE_EMAIL_VERIFICATION) await sendVerificationMail(req, mailToken);
				res.clearCookie(JWT_COOKIE_NAME);
			} else {
				await refreshToken(req, res);
			};

			logger.info(req, `Profile data has been updated`)

			res.send({
				updated: true
			});
		}
		catch (e) {
			res.status(500).send({ error: e.toString() });
			logger.error(req, e);
		}
	};

	async updateMyProfilePhoto(req, res) {

		const uploadFile = {
			mainFolder: "profile_photos",
			customizedFolder: req.decodedJwt.user_id.toString(),
			req: req,

		};


		fileHandler.upload(uploadFile, async (err, randomFilename) => {

			try {

				if (err) return res.status(400).send({ error: err });

				await User.updateProfilePhoto(req.decodedJwt.user_id, randomFilename);

				await refreshToken(req, res);

				logger.info(req, `Profile photo has been updated`);

				res.send({
					updated: true
				});

			}

			catch (e) {
				res.status(500).send({ error: e.toString() });
				logger.error(req, e);
			};

		})
	};

	async getPhoneVerificationCode(req, res) {

		try {

			const code = get5DigitRandomNumber();

			await axios({
				method: "POST",
				url: `${FACEBOOK_URL_BASE}/messages`,
				headers: {
					"Authorization": `Bearer EAAG0PLfvwhQBAIoyPuI9wYmkjMHMXGQyOD32pZAg5o8aAzcmI3jmh20aq41NfFyfbuql6eCaGYGhDrklg4LKZAscPOmjZCCm4Kz2C2c9Ki3OAcjHADdlJSIIiaYRDX5dNKhbypjELC37lsDMuX7aYZBg5bUkZAqA9EmhdMZAxllgPOZAD5jpBUDSluj6HZB0ntM6TBdFGe4LC8of3zAsthFo`,
					"Content-Type": "application/json"
				},
				data: {
					"messaging_product": "whatsapp",
					"recipient_type": "individual",
					"to": req.params.phone,
					"type": "template",
					"template": {
						"name": "verification_code",
						"language": {
							"code": "es_AR"
						},
						"components": [
							{
								"type": "header",
								"parameters": [
									{
										"type": "text",
										"text": HAIRDRESSING_NAME
									}
								]
							},
							{
								"type": "body",
								"parameters": [
									{
										"type": "text",
										"text": code
									},

								]
							}
						]
					}
				}
			})

			await User.updatePhoneVerificationCode(req.decodedJwt.user_id, `${req.params.phone}:${code}`);
			await refreshToken(req,res);
			return res.send({ msg: "El código de verificación ha sido enviado" });
		}
		catch (e) {
			res.send({ err: "El teléfono ingresado no es válido" })
		};




	};

	async verifyPhone(req, res) {

		const enteredCode = req.params.code;

		let userPhoneData = await User.getUserPhoneData(req.decodedJwt.user_id);

		if (userPhoneData.user_phone !== null) return res.send({ err: "Tu teléfono ya ha sido validado" });

		if (userPhoneData.user_phone_verification_code === null) return res.send({ err: "Aún no has generado un código de verificación para tu teléfono" })

		const [phoneToVerify, code] = userPhoneData.user_phone_verification_code.split(":");


		if (enteredCode === code) {

			const expiration = moment(userPhoneData.user_phone_verification_code_expiration);
			const now = moment();

			if (now.isAfter(expiration)) return res.send({ err: "El código de verificación ingresado ha expirado" });

			await User.updatePhone(req.decodedJwt.user_id, phoneToVerify);
			await refreshToken(req,res);
			res.send({ msg: "El teléfono ha sido verificado con éxito" });

		}
		else {
			return res.send({ err: "El código de verificación ingresado no es válido" })
		};




	};

	async updateHairdresser(req, res) {
		try {

			let updatedData = {
				...req.body,
				id: parseInt(req.params.id),

			};


			if (req.body.password) {
				updatedData["password"] = aes256.encrypt(process.env.ENCRYPTION_KEY, req.body.password);
			};

			await User.updateUser(updatedData);

			if (req.body.mail) req.decodedJwt = {
				...req.decodedJwt,
				user_mail: req.body.mail
			}

			if (parseInt(req.params.id) === req.decodedJwt.user_id) {
				await refreshToken(req, res);
			};

			logger.info(req, `Hairdresser with ID: ${req.params.id} profile data has been updated`);

			res.send({
				updated: true
			});

		}

		catch (e) {
			res.status(500).send({ error: e.toString() });
			logger.error(req, e);
		};
	};

	async updateHairdresserState(req, res) {
		try {

			await User.updateHairdresserEnabled(req.params.id, req.query.value === "true" ? true : false);
			logger.info(req, `Hairdresser with ID: ${req.params.id} state has been modified`)
			res.send({ updated: true });

		}

		catch (e) {
			res.status(500).send({ error: e.toString() });
			logger.error(req, e);
		};
	};

	async updateHairdresserSchedule(req, res) {
		try {
			await User.updateHairdresserSchedule(req.params.id, req.body);
			const updatedSchedule = await HairdresserWorkday.getHairdressersMinAndMaxWorkingTimePerDay();
			await Workday.refreshWorkDays(updatedSchedule);
			logger.info(req, `Hairdresser with ID: ${req.params.id} schedule has been modified`);
			res.send({ updated: true });
		}

		catch (e) {
			res.status(500).send({ error: e.toString() });
			logger.error(req, e);
		};
	};

	async updateHairdresserProfilePhoto(req, res) {
		const uploadFile = {
			mainFolder: "profile_photos",
			customizedFolder: req.params.id.toString(),
			req: req,

		};

		fileHandler.upload(uploadFile, async (err, randomFilename) => {

			try {

				if (err) return res.status(400).send({ error: err });

				await User.updateProfilePhoto(req.params.id, randomFilename);

				if (parseInt(req.params.id) === req.decodedJwt.user_id) {
					await refreshToken(req, res);
				};

				logger.info(req, `Hairdresser with ID: ${req.params.id} profile photo has been updated`);

				res.send({
					updated: true
				});

			}

			catch (e) {
				res.status(500).send({ error: e.toString() });
				logger.error(req, e);
			};



		})
	};

	async deleteHairdresser(req, res) {
		try {

			await User.deleteUser(req.params.id);
			await fileHandler.deleteAllDirectoryFiles(`./media/profile_photos/${req.params.id}`);
			await fileHandler.deleteDirectory(`./media/profile_photos/${req.params.id}`);

			logger.info(req, `Hairdresser with ID: ${req.params.id} has been deleted`);

			res.send({
				deleted: true
			});
		}

		catch (e) {
			res.status(500).send({ error: e.toString() });
			logger.error(req, e);
		};
	};

	async register(req, res) {
		try {
			const mailToken = crypto.randomBytes(16).toString("hex");

			req.body.password = aes256.encrypt(process.env.ENCRYPTION_KEY, req.body.password);

			const generatedValues = await User.register({ ...req.body });
			await User.userChangeMailToken(generatedValues.insertId, mailToken);

			if (ENABLE_EMAIL_VERIFICATION) await sendVerificationMail(req, mailToken);

			logger.info(req, `${req.body.username}(ID: ${generatedValues.insertId}) has been registered`)

			res.send({
				registered: true
			});


		}

		catch (e) {
			res.status(500).send({ error: e.toString() });
			logger.error(req, e);
		};
	};

	async verifyMail(req, res) {
		const {
			mail,
			token
		} = req.query;

		if (!(mail && token)) return res.redirect(getRootPath("client"));

		const possibleTokenMail = await User.getMailToken(mail);

		if (possibleTokenMail === null) return res.redirect(getRootPath("client"));

		const tokensAreTheSame = validator.equals(possibleTokenMail, token);

		if (!tokensAreTheSame) return res.redirect(getRootPath("client"));

		await User.verifyMail(mail);

		res.setHeader("Content-Type", "text/html"); /*SI SE VERFICA CON ÉXITO ENVÍA UN HTML DE BIENVENIDA*/
		res.send(`<!DOCTYPE html>
		<html lang="en">
		  <head>
			<meta charset="UTF-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<meta http-equiv="X-UA-Compatible" content="ie=edge" />
			<title>Bienvenido a ${HAIRDRESSING_NAME}</title>
		  </head>
		  <body
			style="
			  background: ${MAIL_SECOND_COLOR};
			  overflow:hidden;
			  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
				Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
			  text-align: center;
			  height: 100vh;
			"
		  >
			<table
			  align="center"
			  border="0"
			  cellpadding="0"
			  cellspacing="0"
			  width="600"
			  height = "100%"
			>
				<td align="center">
				  <div>
					<h1 style="color: ${MAIL_MAIN_COLOR}; letter-spacing: 10px; font-size: 35px;">
					  THE BARBER CLUB
					</h1>
				  </div>
				  <p style="font-size: 19px;color: ${MAIL_MAIN_COLOR};">
					Gracias por unirte a nosotros, ya puedes sacar un turno 
					<a 
					href=\"${getRootPath("client")}\"
					style="color:rgb(0,100,255)" href="">INGRESANDO</a>
				  </p>
				</td>
			  </tr>
			</table>
		  </body>
		</html>`);

		logger.info(req, `Account with Mail: ${req.query.mail} has been verified`);
	};


};


module.exports = new UserController();