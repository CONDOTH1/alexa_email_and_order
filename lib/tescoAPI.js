require('dotenv').config();
var request = require('request');
var emailHTML = require('./../lib/emailHTML');
var message = '';
var options = {};
var iterator = 0;
var total = 0;
var address = [];
var productIDs = [];

function setOptions(url){
  options = {
    url: url,
    type: "GET",
    headers: {
      'Host': 'dev.tescolabs.com',
      'Ocp-Apim-Subscription-Key': process.env.TESCOKEY
    }
  };
}

function totalValue(value){
  total += value;
}

function writeEmail(ingredientDetails, ingredients, callbacktwo){
  ingredientDetails.map(function(element){
    totalValue(element.price);
    message += emailHTML.productPrice(ingredientDetails[0].image, "http://www.tesco.com/groceries/product/search/default.aspx?searchBox=" + element.tpnb, element.name, parseFloat(Math.round(element.price * 100) / 100).toFixed(2), ingredients[iterator -1 ][1]);
  });
  message += "</div></br>";
  if (iterator === ingredients.length) {
    message += emailHTML.orderTotal(parseFloat(Math.round(total * 100) / 100).toFixed(2));
    message += emailHTML.locationMap(address);
    callbacktwo(message, productIDs);
  }
}

module.exports = {
  searchIngredients: function(ingredients, address, callbacktwo){
    function ingredientBody(error, response, body) {
      if (!error && response.statusCode == 200) {
        iterator += 1;
        var info = JSON.parse(body);
        var ingredientDetails = info.uk.ghs.products.results;
        productIDs.push(ingredientDetails[0].tpnb);
        writeEmail(ingredientDetails, ingredients, callbacktwo);
      }
    }
    ingredients.map(function(ingredient){
      var url = "https://dev.tescolabs.com/grocery/products/?query=" + ingredient[0] + "&offset=0&limit=1";
      setOptions(url);
      request.get(options, ingredientBody);
    });
  },

  searchLocation: function(location, callback2){
    function locationBody(error, response, body){
      if(!error && response.statusCode == 200) {
        var info = JSON.parse(body);
        address.push(info.results[0].location.contact.address.lines[0].text);
        address.push(info.results[0].location.contact.address.town);
        address.push(info.results[0].location.contact.address.postcode.replace(' ', ''));
        callback2(address);
      }
    }
    var url = "https://dev.tescolabs.com/locations/search?offset=0&limit=1&sort=near:" + location + "&filter=isoCountryCode:GB";
    setOptions(url);
    request.get(options, locationBody);
  }
};
