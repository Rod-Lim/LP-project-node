'use strict';

const { Service } = require('@hapipal/schmervice'); 

module.exports = class MovieService extends Service {

    create(request){

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

    delete(request){

        const { Movie } = this.server.models();
        const { id } = request.payload;

        return Movie.query().deleteById(id);
    } 

    edit(request) {

        const { Movie } = this.server.models();
        const movie = request.payload;

        const { mailService } = request.services();
        mailService.sendFavoriteMovieModifiedMail(movie);

        return Movie.query().patch(movie).findById(movie.id);
    }
}
