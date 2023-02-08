'use strict';

const { Service } = require('@hapipal/schmervice'); 
const iut_encrypt = require('@fraginox/iut-encrypt');
const Jwt = require('@hapi/jwt');

module.exports = class UserService extends Service {

        async create(request){

            const { User } = this.server.models();
            const user = request.payload;
            
            const mailTaken = await User.query().select('id').where('mail', '=', user.mail);
            
            if (mailTaken.length == 0) {
                user.password = await iut_encrypt.hash(user.password);

                const { mailService } = request.services();
                mailService.sendWelcomeMail(request.payload);

                return User.query().insertAndFetch(user);
            }
            return { error: "This email address already corresponds to another user" }          
        }

        getAll() {
            
            const { User } = this.server.models();
        
            return User.query().select();
        }

        async delete(request){

            const { User } = this.server.models();
            const { id } = request.payload;

            await User.query().deleteById(id);
        } 

        async edit(user) {

            const { User } = this.server.models();
            if (user.password) {
                user.password = await iut_encrypt.hash(user.password);
            }
            await User.query().patch(user).findById(user.id);
        }

        async login(creditentials) {
            const { User } = this.server.models();
            
            const user = await User.query().findOne({mail : creditentials.mail});
            if (user) {
                const isRightPassword = await iut_encrypt.compare(creditentials.password, user.password);
                if (isRightPassword) {
                     return {
                        "JWT Token" : Jwt.token.generate(
                            {
                                aud: 'urn:audience:iut',
                                iss: 'urn:issuer:iut',
                                id: user.id,
                                firstName: user.firstName,
                                lastName: user.lastName,
                                email: user.mail,
                                scope: user.role
                            },
                            {
                                key: 'this_is_my_key', // La clé qui est définie dans lib/auth/strategies/jwt.js
                                algorithm: 'HS512'
                            },
                            {
                                ttlSec: 14400 // 4 hours
                            }
                        )
                     };
                }
            }
            return { error: "Problem encountered while login" }
        }

        async addFavorite(request) {

            const { Favorites, Movie } = this.server.models();
            const movie = await Movie.query().select('id').whereRaw('?? = ??', ['id', request.payload.movie_id]);

            if (movie.length != 0) {
                const exists = await Favorites.query().select().whereRaw('?? = ?? AND ?? = ??', ['user_id', request.auth.credentials.id, 'movie_id', request.payload.movie_id]);
                if (exists.length != 0) {
                    return { error: "Movie already in favorites !" }
                }
                return Favorites.query().insertAndFetch({
                    'user_id': request.auth.credentials.id,
                    'movie_id': request.payload.movie_id
                });
            }
            return { error: "Problem encountered while adding a favorite movie to a user" }
        }

        async removeFavorite(request) {

            const { Favorites } = this.server.models();

            return Favorites.query().delete().where('user_id', '=', request.auth.credentials.id).where('movie_id', '=', request.payload.movie_id);
        }
}
