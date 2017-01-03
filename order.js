require('dotenv').config();
var kraft = require('./lib/kraft');
var request = require('request');
var sendGrid = require('./lib/sendGrid');
var tescoAPI = require('./lib/tescoAPI');
var tescoGroceries = require('./lib/tescoGroceries');
var parseJson = require('./lib/parseIngredients');
var iterator = 0;


// utilises the tesco app endpoints. Requires initial login to start session and get key. Get and parse the recipe information, along with getting the necessary tesco ingredients.

function addIngredientsToBasket(callback) {
  tescoGroceries.login(function(sessionkey){
  kraft.getRecipe(function(result){
    var recipeArray = parseJson.parseIngredients(result);
    tescoAPI.searchIngredients(recipeArray, [], function(message, productIDs){
      productIDs.map(function(element){
          tescoGroceries.addProduct(element.toString(), sessionkey.toString());
          if (iterator === productIDs.length) {
            callback(sessionkey.toString());
          }
      });
    });
  });
});
}

addIngredientsToBasket(function(sessionkey){
  basket.readyForCheckout(sessionkey);
});
