var recipes = require("kraft-recipe-api");
require('dotenv').config();
var request = require('request');
var email = require('./lib/email')
var shoppingList = []
var mappedArray = []
var message = '';
var iterator = 0;

recipes.getById(138284, function(err, result) {
  parseIngredients(result);
});

function parseIngredients(recipeJSON){
  var details = recipeJSON["IngredientDetails"];
  mappedArray = details.map( function(element) { return element.IngredientName } );
  mappedArray.forEach(function(element){
    getTescoIngredients(element)
  })
}

function getTescoIngredients(ingredient){

  var options = {
    url: "https://dev.tescolabs.com/grocery/products/?query=" + ingredient + "&offset=0&limit=5",
    type: "GET",
    headers: {
      'Host': 'dev.tescolabs.com',
      'Ocp-Apim-Subscription-Key': process.env.SENDGRIDKEY
    }
  };
  function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
      var info = JSON.parse(body);
      var ingredientDetails = info.uk.ghs.products.results
      message += ingredient.toUpperCase() + "\n\n\n"
      ingredientDetails.forEach(function(element){
        message += "Product: " + element.name + " Price: £" + element.price + " Promotion: " + element.PromotionDescription +  " Quantity: " + element.ContentsQuantity + element.UnitQuantity + "\n\n"
      })
      iterator += 1
      if (iterator === mappedArray.length) {
        email.sendEmail(message);
      }
    }
  }
  request.get(options, callback);
}
