var recipes = require("kraft-recipe-api");

// gets the recipe details from the kraft-recipe-api

module.exports = {
   getRecipe: function(callback){
    recipes.getById(138284, function(err, result) {callback(result);});
  }
};
