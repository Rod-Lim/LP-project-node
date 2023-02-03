'use strict';

const { Service } = require('@hapipal/schmervice');
const nodemailer = require('nodemailer');

module.exports = class MailService extends Service {

        sendWelcomeMail(user){

            // Créer un compte sur https://ethereal.email/ et remplir les constantes :
            const host = 'smtp.ethereal.email';
            const port = 587;
            const mail_user = 'lilyan.johns@ethereal.email';
            const mail_pass = 'JXCfffGK4D4nfXUVu5';

            const transporter = nodemailer.createTransport({
                host: host,
                port: port,
                auth: {
                    user: mail_user,
                    pass: mail_pass
                },
                tls: {
                    rejectUnauthorized: false
                }
            });

            const message = {
                from: mail_user,
                to: user.mail,
                subject: "Bienvenue "+ user.firstName +" !",
                text: "Que la force soit avec toi, jeune Padawan !"
            };

            try {
                transporter.sendMail(message);
                return { "Success": "Mail bien envoyé." }
            } catch (e) {
                return { "Error": e }
            }
            
        }
}
