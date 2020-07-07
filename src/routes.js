const express = require('express');
const { celebrate, Segments, Joi } = require('celebrate');

const RecipeController = require('./controller/RecipeController');

const routes = express.Router();

routes.get('/recipes/', celebrate({
    [Segments.QUERY]: Joi.object().keys({
        i: Joi.string().required()
    }),
}),RecipeController.get);

module.exports = routes;