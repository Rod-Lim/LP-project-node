'use strict';

const Joi = require('joi');

module.exports = [
    {
        method: 'post',
        path: '/movie',
        options: {
            auth: {
                scope: [ 'admin' ]
            },
            tags: ['api'],
            validate: {
              payload: Joi.object({
                title: Joi.string().min(2).example('Ça').description('Movie\'s title'),
                description: Joi.string().min(30).example("À Derry, dans le Maine, sept adolescents ayant du mal à s'intégrer [...] face-à-face avec un clown répondant au nom de Grippe-Sou...").description('Movie\'s description'),
                releaseDate: Joi.date(),
                director: Joi.string().min(3).example('Andrés Muschietti').description('Movie\'s director'),
              })
            }
        },
        handler: async (request, h) => {
    
            const { movieService } = request.services();

            return await movieService.create(request);
        }
    },
    
    {
        method: 'get',
        path: '/movies',
        options: {
            auth: {
                scope: ['user', 'admin'],
            },
            tags: ['api'],
        },
        handler: async (request, h) => {
            
            const { movieService } = request.services();
            
            return await movieService.getAll();
        }
    },
    {
        method: 'delete',
        path: '/movie/{id}',
        options: {
            auth : {
                scope: [ 'admin' ]
            },
            tags: ['api'],
            validate: {
                payload: Joi.object({
                  id: Joi.number().integer().greater(0).example('1').description('ID of the movie'),
                })
              }
        },
        handler: async (request, h) => {

            const { movieService } = request.services();
            
            await movieService.delete(request);

            return 'Movie deleted';
        }
    },
    {
        method: 'patch',
        path: '/movie/{id}',
        options: {
            auth : {
                scope: [ 'admin' ]
            },
            tags: ['api'],
            validate: {
                payload: Joi.object({
                    id : Joi.number().integer().greater(0).example('1').description('ID of the movie'),
                    title: Joi.string().min(2).example('Ça').description('Movie\'s title'),
                    description: Joi.string().min(30).example("À Derry, dans le Maine, sept adolescents ayant du mal à s'intégrer [...] face-à-face avec un clown répondant au nom de Grippe-Sou...").description('Movie\'s description'),
                    releaseDate: Joi.date(),
                    director: Joi.string().min(3).example('Andrés Muschietti').description('Movie\'s director'),
                })
              }
        },
        handler: async (request, h) => {

            const { movieService } = request.services();
            
            await movieService.edit(request);

            return 'Movie edited';
        }
    },
];