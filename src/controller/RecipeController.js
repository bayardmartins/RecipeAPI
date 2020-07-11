const config = require('../../config');
const util = require('util');
const request = require('request');
const requestPromise = util.promisify(request);

const apiRecipePuppyURL = config.apiRecipePuppyURL;
const apiGiphyURL = config.apiGiphyURL;
const giphyApiKey = config.giphyApiKey;

/**
 * Transforma o input em um array de ingredientes.
 * @param {string} pQuery query da url.
 * @return {[string]} O array de ingredientes.
 */
function getIngredientArray(pQuery) {
  const ingredientArray = pQuery.split(',');
  if (ingredientArray.length <= 3) {
    ingredientArray.sort();
    return (ingredientArray);
  }
  return (undefined);
};

/**
 * Faz requisição à API Recipe Puppy.
 * @param {[string]} ingredientArray lista de ingredientes.
 * @return {json} O retorno da api.
 */
async function getRecipesByIngredientList(ingredientArray) {
  const url = apiRecipePuppyURL+'?i='+ingredientArray;
  return requestPromise(url).then((response) => {
    if (response.statusCode === 200) {
      return response.body;
    } else if (response.statusCode === 503) {
      return response.statusCode;
    }
    return Promise.reject(response.statusCode);
  }).catch((err) => {
    return err;
  });
}

/**
 * monta o objeto json na configuração desejada.
 * @param {json} requestRecipes json retornado da getRecipesByIngredientList.
 * @param {json} ingredientArray O array de ingredientes.
 * @return {[string]} Dicionário com keywords e recipes.
 */
async function buildRecipeList(requestRecipes, ingredientArray) {
  const recipeListBuilt = [];
  requestRecipeObject = JSON.parse(requestRecipes);
  let i = 0;
  for (i; i < requestRecipeObject.results.length; i++) {
    const gif = await getGif(requestRecipeObject.results[i].title);
    recipeListBuilt[i] = {
      'title': requestRecipeObject.results[i].title,
      'ingredients': requestRecipeObject.results[i].ingredients,
      'link': requestRecipeObject.results[i].href,
      'gif': gif,
    };
  };

  const recipeList = {
    'keywords': ingredientArray,
    'recipes': recipeListBuilt,
  };
  return (recipeList);
}

/**
 * Faz requisição à API Giphy.
 * @param {string} pTitle título da receita.
 * @return {string} Link do gif.
 */
function getGif(pTitle) {
  const url = `${apiGiphyURL}search?api_key=
    ${giphyApiKey}&q=${pTitle}&limit=&offset=&rating=g&lang=en`;
  return requestPromise(url).then((response) => {
    if (response.statusCode === 200) {
      const res = JSON.parse(response.body);
      const gif = res.data[0].images.original.url;
      return gif;
    } else if (response.statusCode === 503) {
      return config.msgGiphyUnavailable;
    }
    return Promise.reject(response.statusCode);
  }).catch((err) => {
    return err;
  });
};

module.exports = {
  async get(req, res) {
    const url = require('url');
    const urlParts = url.parse(req.url, true);
    const query = urlParts.query.i;
    const ingredientArray = getIngredientArray(query);
    const requestRecipes = await getRecipesByIngredientList(ingredientArray);
    if (requestRecipes === 503) {
      return res.send(config.msgRecipePuppyUnavailable);
    }
    const recipeList = await buildRecipeList(requestRecipes, ingredientArray);
    return res.json(recipeList);
  },
};
