'use strict';

const { Service } = require('@hapipal/schmervice'); 
const Jwt = require('@hapi/jwt');

module.exports = class MovieService extends Service {

        async create(movie){

            const { Movie } = this.server.models();

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

        async edit(movie) {

            const { Movie } = this.server.models();
            await Movie.query().patch(movie).findById(movie.id);
        }
}
