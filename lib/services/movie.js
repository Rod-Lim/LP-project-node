'use strict';

const { Service } = require('@hapipal/schmervice'); 
const Jwt = require('@hapi/jwt');

module.exports = class MovieService extends Service {

        async create(request){

            const { Movie } = this.server.models();
            const movie = request.payload;

            const { mailService } = request.services();
            mailService.sendNewMovieMail(movie);

            return Movie.query().insertAndFetch(movie);
        }

        getAll() {
            
            const { Movie } = this.server.models();
        
            return Movie.query().select();
        }

        async delete(request){

            const { Movie } = this.server.models();
            const { id } = request.payload;

            await Movie.query().deleteById(id);
        } 

        async edit(request) {

            const { Movie } = this.server.models();
            const movie = request.payload;

            const { mailService } = request.services();
            mailService.sendFavoriteMovieModifiedMail(movie);

            await Movie.query().patch(movie).findById(movie.id);
        }
}
