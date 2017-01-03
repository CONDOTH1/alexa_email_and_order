require('dotenv').config();
var kraft = require('./lib/kraft');
var sendGrid = require('./lib/sendGrid');
var tescoAPI = require('./lib/tescoAPI');
var parseJson = require('./lib/parseIngredients');

// emails the shopping list in html format. first gets details from kraft, the result is then past to parseIngredients. The nearest tesco location is then found along with the necessary ingredients. Finally the information is compiled and emailed.

function emailShoppingList() {
  kraft.getRecipe(function(result){
    var recipeArray = parseJson.parseIngredients(result);
    tescoAPI.searchLocation(process.env.POSTCODE, function(postcode){
      tescoAPI.searchIngredients(recipeArray, postcode, function(message, productIDs){
        sendGrid.sendEmail(message);
      });
    });
  });
}

emailShoppingList();
