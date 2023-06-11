const nodemailer = require('nodemailer');
const logger = require('../log');
const {
  SENDER_EMAIL,
  SENDER_PASSWORD,
  HAIRDRESSING_NAME,
  MAIL_MAIN_COLOR,
  MAIL_SECOND_COLOR
} = require('../../constants');
const { getRootPath } = require('../../functions/getRootPath');

const sendVerificationMail = (req, mailToken) => {

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: SENDER_EMAIL,
      pass: SENDER_PASSWORD
    }
  });

  const mailOptions = {
    from: SENDER_EMAIL,
    to: req.body.mail,
    subject: `Bienvenido a ${HAIRDRESSING_NAME}`,
    html: getMailHtml(req.body.mail, mailToken)
  };

  transporter.sendMail(mailOptions, function (err, info) {

    if (err) logger.error(req, err);



  });
};

const getMailHtml = (to, mailToken) => {
  return `<!DOCTYPE html>
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
              Gracias por unirte a nosotros, por favor, 
              <a 
              href=\"${getRootPath("server", true)}/users/mail/verification?mail=${to}&token=${mailToken}\"
              style="color:rgb(0,100,255)" href="">VERIFICA TU MAIL</a>
            </p>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
};

module.exports = sendVerificationMail;