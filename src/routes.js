const express = require('express');
const {celebrate, Segments, Joi} = require('celebrate');

const RecipeController = require('./controller/RecipeController');

// eslint-disable-next-line new-cap
const routes = express.Router();

routes.get('/recipes/', celebrate({
  [Segments.QUERY]: Joi.object().keys({
    i: Joi.string(),
  }),
}), RecipeController.get);

module.exports = routes;
