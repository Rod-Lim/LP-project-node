'use strict';

const Joi = require('joi');

module.exports = [
    {
        method: 'post',
        path: '/user',
        options: {
            auth: false,
            tags: ['api'],
            validate: {
              payload: Joi.object({
                firstName: Joi.string().required().min(3).example('John').description('Firstname of the user'),
                lastName: Joi.string().required().min(3).example('Doe').description('Lastname of the user'),
                username: Joi.string().min(5).example('Xx_S1Ay3R_xX').description('User\'s username'),
                password: Joi.string().min(8).example('L_AVO3fgT').description('User\'s password'),
                mail: Joi.string().min(8).example('user.mail@gmail.com').description('User\'s mail address'),
              })
            }
        },
        handler: async (request, h) => {
    
            const { userService } = request.services();

            return await userService.create(request);
        }
    },
    {
        method: 'get',
        path: '/users',
        options: {
            auth: {
                scope: ['user', 'admin'],
            },
            tags: ['api'],
        },
        handler: async (request, h) => {
            
            const { userService } = request.services();
            
            return await userService.getAll();
        }
    },
    {
        method: 'delete',
        path: '/user/{id}',
        options: {
            auth : {
                scope: [ 'admin' ]
            },
            tags: ['api'],
            validate: {
                payload: Joi.object({
                  id: Joi.number().integer().greater(0).example('1').description('ID of the user'),
                })
              }
        },
        handler: async (request, h) => {

            const { userService } = request.services();
            
            return await userService.delete(request);
        }
    },
    {
        method: 'patch',
        path: '/user/{id}',
        options: {
            auth : {
                scope: [ 'admin' ]
            },
            tags: ['api'],
            validate: {
                payload: Joi.object({
                  id: Joi.number().integer().greater(0).example('1').description('ID of the user'),
                  firstName: Joi.string().required().min(3).example('John').description('Firstname of the user'),
                  lastName: Joi.string().required().min(3).example('Doe').description('Lastname of the user'),
                  username: Joi.string().min(5).example('Xx_S1Ay3R_xX').description('User\'s username'),
                  password: Joi.string().min(8).example('L_AVO3fgT').description('User\'s password'),
                  mail: Joi.string().min(8).example('user.mail@gmail.com').description('User\'s mail address'),
                })
              }
        },
        handler: async (request, h) => {

            const { userService } = request.services();
            
            return await userService.edit(request.payload);
            
        }
    },
    {
        method: 'post',
        path: '/user/login',
        options: {
            auth: false,
            tags: ['api'],
            validate: {
              payload: Joi.object({
                mail: Joi.string().min(8).example('user.mail@gmail.com').description('User\'s mail address'),
                password: Joi.string().min(8).example('L_AVO3fgT').description('User\'s password'),
              })
            }
        },
        handler: async (request, h) => {
    
            const { userService } = request.services();

            return await userService.login(request.payload);
        }
    },
    {
        method: 'post',
        path: '/user/favorite',
        options: {
            auth: {
                scope: ['user', 'admin'],
            },
            tags: ['api'],
            validate: {
              payload: Joi.object({
                movie_id: Joi.number().integer().greater(0).example('1').description('ID of the movie'),
              })
            }
        },
        handler: async (request, h) => {
    
            const { userService } = request.services();

            return await userService.addFavorite(request);
        }
    },

    {
        method: 'delete',
        path: '/user/favorite',
        options: {
            auth: {
                scope: ['user', 'admin'],
            },
            tags: ['api'],
            validate: {
              payload: Joi.object({
                movie_id: Joi.number().integer().greater(0).example('1').description('ID of the movie'),
              })
            }
        },
        handler: async (request, h) => {

            const { userService } = request.services();
            
            return await userService.removeFavorite(request);
        }
    },
    {
        method: 'get',
        path: '/user/favorites',
        options: {
            auth: {
                scope: ['user', 'admin'],
            },
            tags: ['api'],
        },
        handler: async (request, h) => {
            
            const { userService } = request.services();
            
            return await userService.getAllFavorites(request);
        }
    },
];