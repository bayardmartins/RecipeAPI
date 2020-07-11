const config = require('../../config');
const util = require('util');
const request = require('request');
const requestPromise = util.promisify(request);

const apiRecipePuppyURL = config.apiRecipePuppyURL;
const apiGiphyURL = config.apiGiphyURL;
const giphyApiKey = config.giphyApiKey;

function getIngredientArray(pQuery){
  var ingredientArray = pQuery.split(',');
  if(ingredientArray.length <= 3){
    ingredientArray.sort();
    return (ingredientArray);
  }
    return (undefined);
};

async function getRecipesByIngredientList(ingredientArray) {
  let url = apiRecipePuppyURL+'?i='+ingredientArray;
  return requestPromise(url).then(response => {
    if(response.statusCode === 200) {
      return response.body
    }
    return Promise.reject(response.statusCode)
    }).catch(err => {
      return err
  })
}

async function buildRecipeList (requestRecipes,ingredientArray) {
  let recipeListBuilt = [];
  requestRecipeObject = JSON.parse(requestRecipes);
  let i = 0;
    for (i; i < requestRecipeObject.results.length; i++) {
      let gif = await getGif(requestRecipeObject.results[i].title);
      recipeListBuilt[i] = {
   	    "title": requestRecipeObject.results[i].title,
   	    "ingredients": requestRecipeObject.results[i].ingredients,
   	    "link": requestRecipeObject.results[i].href,
   	    "gif": gif
       }
   };

  let recipeList = {
    "keywords": ingredientArray,
    "recipes": recipeListBuilt,
  };
  return (recipeList);
}

function getGif(pTitle){
  let url = `${apiGiphyURL}search?api_key=${giphyApiKey}&q=${pTitle}&limit=&offset=&rating=g&lang=en`;
  return requestPromise(url).then(response => {
    if(response.statusCode === 200) {
      let res = JSON.parse(response.body); 
      let gif = res.data[0].images.original.url;
      return gif;
    }
    return Promise.reject(response.statusCode)
    }).catch(err => {
      console.log('erro '+err);
      return err
  })  
};

module.exports = {
  async get (req,res) {
    const url = require('url');
    const url_parts = url.parse(req.url, true);
    const query = url_parts.query.i;
    const ingredientArray = getIngredientArray(query);
    const requestRecipes = await getRecipesByIngredientList(ingredientArray);
    const recipeList = await buildRecipeList(requestRecipes,ingredientArray)
    return res.json(recipeList);
  }
}