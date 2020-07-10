const axios = require('axios');
const apiRecipePuppyURL = 'http://www.recipepuppy.com/api/';
const util = require('util');
const request = require('request');
const requestPromise = util.promisify(request);

function getIngredientArray(pQuery){
  var ingredientArray = pQuery.split(',');
  if(ingredientArray.length <= 3){
      return (ingredientArray);
  }
      return (undefined);
};

async function getRecipesByIngredientList(ingredientArray) {
  let url = apiRecipePuppyURL+'?i='+ingredientArray;
  console.log("getRecipesByIngredientList start")
  return requestPromise(url).then(response => {
    console.log('getRecipesByIngredientList pre '+ response.statusCode)
    if(response.statusCode === 200) {
      console.log('getRecipesByIngredientList iner');
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
  console.log('buildRecipeList start');
  console.log(requestRecipeObject.results);
  let i = 0;
    for (i; i < requestRecipeObject.results.length; i++) {
     console.log('buildRecipeList inner loop '+i);
     recipeListBuilt[i] = {
   	    "title": requestRecipeObject.results[i].title,
   	    "ingredients": requestRecipeObject.results[i].ingredients,
   	    "link": requestRecipeObject.results[i].href,
   	    "gif": getGif(requestRecipeObject.results[i].title)
       }
   };

  let recipeList = {
    "keywords": ingredientArray,
    "recipes": recipeListBuilt,
  };
  return (recipeList);
}

function getGif(pTitle){
    //todo: chamada a API 
    let link = "www.google.com";
    return (link);
};

module.exports = {
  async get (req,res) {
    const url = require('url');
    const url_parts = url.parse(req.url, true);
    const query = url_parts.query.i;
    const ingredientArray = getIngredientArray(query);
    const requestRecipes = await getRecipesByIngredientList(ingredientArray);
    const recipeList = await buildRecipeList(requestRecipes,ingredientArray)
    return res.json(recipeList)
    .catch(() => {return res.status(400).send("parâmetros enviados são inválidos")});
  }
}