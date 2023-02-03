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
    
            const { userService, mailService } = request.services();

            const response = await userService.create(request.payload);
            mailService.sendWelcomeMail(request.payload);
            return response;
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
            
            await userService.delete(request);

            return 'User deleted';
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
            
            await userService.edit(request.payload);

            return 'User edited';
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
];