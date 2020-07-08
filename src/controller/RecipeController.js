function getRecipeList(pQuery){
    
    ingredientList = getIngredientArray(pQuery);
    if(ingredientList){
        let list = getRecipesByIngredientList(ingredientList);
    
        let recipeFullList = {
            "keywords": ingredientList,
        //foreach object in list.results
        //{
            "recipes": [getRecipeToDisplay("result"),
                        getRecipeToDisplay("result"),
                        getRecipeToDisplay("result")]
        //}
        };
        return (recipeFullList);
    }else{
        return (undefined);
    }
};

function getIngredientArray(pQuery){
    //todo: validar qtd de ingredientes
    return (['ingredient1','ingredient2']);
};

function getRecipesByIngredientList(pRec){
    //todo: chamada a API
    //tratamento de dados
    return ('return.results');
};

function getGif(pTitle){
    //todo: chamada a API 
    let link = "www.google.com";
    return (link);
};

function getRecipeToDisplay(pResult){
    
    let gif = getGif(pResult.title);
    
    let recipeToDisplay = {
		    "title": "pResult.title",
		    "ingredients": ["pResult.ingredients"],
		    "link": "pResult.href",
		    "gif": gif
	    }
    return (recipeToDisplay);
};

module.exports = {
    async get (req,res) {
        const query = req.query;
        let fullRecipeList = getRecipeList(query);
        if(fullRecipeList){
            return res.json(fullRecipeList);
        }else{
            return ("parâmetros enviados são inválidos");
        }
    }
}