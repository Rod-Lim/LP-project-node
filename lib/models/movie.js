'use strict';

const Joi = require('joi');
const { Model } = require('@hapipal/schwifty');

module.exports = class Movie extends Model {

    static get tableName() {

        return 'movie';
    }

    static get joiSchema() {

        return Joi.object({
            id: Joi.number().integer().greater(0),
            title: Joi.string().min(2).example('Ça').description('Movie\'s title'),
            description: Joi.string().min(30).example("À Derry, dans le Maine, sept adolescents ayant du mal à s'intégrer [...] face-à-face avec un clown répondant au nom de Grippe-Sou...").description('Movie\'s description'),
            releaseDate: Joi.date(),
            director: Joi.string().min(3).example('Andrés Muschietti').description('Movie\'s director'),
            createdAt: Joi.date(),
            updatedAt: Joi.date(),
        });
    }

    $beforeInsert(queryContext) {

        this.updatedAt = new Date();
        this.createdAt = this.updatedAt;
    }

    $beforeUpdate(opt, queryContext) {

        this.updatedAt = new Date();
    }
};