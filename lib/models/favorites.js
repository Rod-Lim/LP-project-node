'use strict';

const Joi = require('joi');
const { Model } = require('@hapipal/schwifty');

module.exports = class Favorites extends Model {

    static get tableName() {

        return 'favorites';
    }

    static get joiSchema() {

        return Joi.object({
            user_id: Joi.number().integer().greater(0),
            movie_id: Joi.number().integer().greater(0),
        });
    }

    static get idColumn() {
        
        return ['user_id', 'movie_id'];
    }
    
};