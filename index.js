var recipes = require("kraft-recipe-api");
require('dotenv').config();
var request = require('request');
var email = require('./lib/email');
var tesco = require('./lib/tesco');
var basket = require('./lib/addToBasket');
var shoppingList = [];
var mappedArray = [];
var ingredients = [];
var message = '';
var iterator = 0;
var quantity = [];
var fixedMappedArray = [];
var removeWords = [
  'KRAFT',
  'Original',
  'HEINZ',
  'oil-packed'
];

// gets the recipe details from the kraft-recipe-api

function getRecipeFromKraft(callback){
  recipes.getById(138284, function(err, result) {callback(result);});
}

// emails the shopping list in html format. first gets details from kraft, the result is then past to parseIngredients. The nearest tesco location is then found along with the necessary ingredients. Finally the information is compiled and emailed.

function emailShoppingList() {
  getRecipeFromKraft(function(result){
    parseIngredients(result);
    tesco.searchLocation(process.env.POSTCODE, function(postcode){
      tesco.searchIngredients(fixedMappedArray, postcode, function(message, productIDs){
        email.sendEmail(message);
      });
    });
  });
}

// utilises the tesco app endpoints. Requires initial login to start session and get key. Get and parse the recipe information, along with getting the necessary tesco ingredients. 

function addIngredientsToBasket(callback) {
  basket.login(function(sessionkey){
  getRecipeFromKraft(function(result){
    parseIngredients(result);
    tesco.searchIngredients(fixedMappedArray, [], function(message, productIDs){
      productIDs.map(function(element){
          basket.addProduct(element.toString(), sessionkey.toString());
          basket.addProduct(element.toString(), 1);
          if (iterator === productIDs.length) {
            callback(sessionkey.toString());
          }
      });
    });
  });
});
}
// basket.getCollectionLocation();
// basket.chooseCollectionLocation();
// basket.readyForCheckout();


function parseIngredients(recipeJSON, callback){
  var details = recipeJSON.IngredientDetails;
  // console.log(details);
  // mappedArray = details.map( function(element) { return element.IngredientName ; });
  details.map(function(element) {
    mappedArray.push([element.IngredientName, element.QuantityText + " " + element.QuantityUnit]);
  });
  fixedMappedArray = mappedArray.map(function(ingredient){return removeBrands(ingredient); });
  // tesco.searchLocation('EC1Y2AL', function(postcode){
  //   tesco.searchIngredients(fixedMappedArray, postcode, callback);
  // });
}



function removeBrands(ingredient){
  var fixedIngredient = ingredient[0];
  removeWords.forEach(function(word){
      fixedIngredient = fixedIngredient.replace(word, '').trim();
    });
  return [fixedIngredient, ingredient[1]];
}

addIngredientsToBasket(function(sessionkey){
  basket.readyForCheckout(sessionkey);
});

// emailShoppingList();
