'use strict';

const Joi = require('joi');
const { Model } = require('@hapipal/schwifty');

module.exports = class User extends Model {

    static get tableName() {

        return 'user';
    }

    static get joiSchema() {

        return Joi.object({
            id: Joi.number().integer().greater(0),
            firstName: Joi.string().min(3).example('John').description('Firstname of the user'),
            lastName: Joi.string().min(3).example('Doe').description('Lastname of the user'),
            password: Joi.string().min(8).example('L_AVO3fgT').description('User\'s password'),
            mail: Joi.string().min(8).example('user.mail@gmail.com').description('User\'s mail address'),
            username: Joi.string().min(5).example('X_o_X').description('User\'s username'),
            createdAt: Joi.date(),
            updatedAt: Joi.date(),
            role: Joi.string().valid('user', 'admin', '').example('user').description('User\'s role').default('user').optional(),
        });
    }

    $beforeInsert(queryContext) {

        this.updatedAt = new Date();
        this.createdAt = this.updatedAt;
        if (!this.role) {
            this.role = 'user';
        }
    }

    $beforeUpdate(opt, queryContext) {

        this.updatedAt = new Date();
    }
};