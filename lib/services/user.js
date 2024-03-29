'use strict';

const { Service } = require('@hapipal/schmervice'); 
const iut_encrypt = require('@fraginox/iut-encrypt');
const Jwt = require('@hapi/jwt');
const BOOM = require('@hapi/boom');

module.exports = class UserService extends Service {

    async create(request){

        const { User } = this.server.models();
        const user = request.payload;
        
        const mailTaken = await User.query().select('id').where('mail', '=', user.mail);
        
        if (mailTaken.length != 0) {
            throw BOOM.conflict();
        }
        user.password = await iut_encrypt.hash(user.password);

        const { mailService } = request.services();
        mailService.sendWelcomeMail(request.payload);

        return User.query().insertAndFetch(user);     
    }

    getAll() {
        
        const { User } = this.server.models();
    
        return User.query().select();
    }

    delete(request){

        const { User } = this.server.models();
        const { id } = request.payload;

        return User.query().deleteById(id);
    } 

    async edit(user) {

        const { User } = this.server.models();
        if (user.password) {
            user.password = await iut_encrypt.hash(user.password);
        }
        return User.query().patch(user).findById(user.id);
    }

    async login(creditentials) {
        const { User } = this.server.models();
        
        const user = await User.query().findOne({mail : creditentials.mail}).throwIfNotFound();
        const isRightPassword = await iut_encrypt.compare(creditentials.password, user.password);
        if (!isRightPassword) {
            throw BOOM.conflict();
        }
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
                    key: process.env.API_KEY,
                    algorithm: 'HS512'
                },
                {
                    ttlSec: 14400 // 4 hours
                }
            )
        };
    }

    async addFavorite(request) {

        const { Favorites, Movie } = this.server.models();
        const movie = await Movie.query().select('id').where('id', '=', request.payload.movie_id).throwIfNotFound;

        const exists = await Favorites.query().select().where({
            'user_id' : request.auth.credentials.id,
            'movie_id' : request.payload.movie_id
        });
        if (exists.length != 0) {
            throw BOOM.conflict();
        }

        return Favorites.query().insertAndFetch({
            'user_id': request.auth.credentials.id,
            'movie_id': request.payload.movie_id
        });
    }

    removeFavorite(request) {

        const { Favorites } = this.server.models();

        return Favorites.query().delete().where({
            'user_id': request.auth.credentials.id, 
            'movie_id': request.payload.movie_id
        });
    }

    getAllFavorites(request) {
        
        const { Favorites } = this.server.models();
    
        return Favorites.query().select().where('user_id', '=', request.auth.credentials.id);
    }
}
