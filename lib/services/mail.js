'use strict';

const { Service } = require('@hapipal/schmervice');
const nodemailer = require('nodemailer');

module.exports = class MailService extends Service {

        sendMail(receiver ,subject, text) {
            // Créer un utilisateur (ou un compte) sur https://ethereal.email/ et remplir les constantes :
            const host = 'smtp.ethereal.email';
            const port = 587;
            const mail_user = 'marietta.schuppe@ethereal.email';
            const mail_pass = 'fbhnJbwgcutbbmnj9y';

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
                to: receiver,
                subject: subject,
                text: text
            };

            try {
                transporter.sendMail(message);
                return { "Success": "Mail bien envoyé." }
            } catch (e) {
                return { "Error": e }
            }
        }

        sendWelcomeMail(user){

            return this.sendMail(
                user.mail,
                "Bienvenue "+ user.firstName +" !", 
                "Que la force soit avec toi, jeune Padawan !"
            );
        }

        async sendNewMovieMail(movie) {
            
            const { User } = this.server.models();

            const users = await User.query().select();
            
            for (let i = 0; i < users.length; i++) {
                this.sendMail(
                    users[i].mail,
                    "Un nouveau film est disponible !",
                    "Le nouveau film \"" + movie.title + "\" fait son entrée scène ! Il est dès maintenant disponible chez nous !"
                )
            }

            return { "Success" : "Mails send to users" };
        }

        async sendFavoriteMovieModifiedMail(movie) {
            
            const { User, Favorites } = this.server.models();

            const users = await User.query().select();
            
            for (let i = 0; i < users.length; i++) {
                let favorites = await Favorites.query().select().where('user_id', '=', users[i].id).where('movie_id', '=', movie.id); 
                if (favorites.length != 0) {
                    this.sendMail(
                        users[i].mail,
                        "un film favori a été modifié !",
                        "Le film \"" + movie.title + "\" qui fait partie de vos favoris viens d'être modifié. N'hésitez pas à aller checker ça !"
                    )
                }
            }

            return { "Success" : "Mails send to users" };
        }
}
