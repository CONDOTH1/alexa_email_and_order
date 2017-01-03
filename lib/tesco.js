require('dotenv').config();
var request = require('request');
// var message = "<h1 style='font-family:Verdana;text-align:center;';>Your Shopping List</h1></br>";
var message = '';
var url = [];
var options = {};
var iterator = 0;
var product ='';
var total = 0;
var address = [];
var productIDs = [];

function setOptions(url){
  options = {
    // url: "https://dev.tescolabs.com/grocery/products/?query=" + ingredient + "&offset=0&limit=1",
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

module.exports = {
  searchIngredients: function(ingredients, address, callbacktwo){
    function ingredientBody(error, response, body) {
      if (!error && response.statusCode == 200) {
        iterator += 1;
        var info = JSON.parse(body);
        var ingredientDetails = info.uk.ghs.products.results;
        // console.log(ingredientDetails);
        productIDs.push(ingredientDetails[0].tpnb);
        ingredientDetails.map(function(element){
          totalValue(element.price)
          message += `<div style='margin:5px;display:inline-block;font-family:Verdana;width:90%;height:100px;padding:1%;border-bottom:solid;border-color:gray;border-width:1px;'><div><img src=${ingredientDetails[0].image}></img></div><div><a href="http://www.tesco.com/groceries/product/search/default.aspx?searchBox=${element.tpnb}&newSort=true&search=Search">add to cart</a></div><div style='position:relative;text-align:center;bottom:50%;'>` + element.name + " - £" + parseFloat(Math.round(element.price * 100) / 100).toFixed(2) + `</div><div style='position:relative;text-align:right;bottom:80%;'><div style='position:relative;text-align:right;bottom:50%;'>${ingredients[iterator -1 ][1]}</div></br><input type='checkbox' id='cbox1' value='first_checkbox' style='zoom:2';></div></br>`
        });
        message += "</div></br>";
        if (iterator === ingredients.length) {
          message += `<div style='margin:3px;display:inline-block;font-family:Verdana;width:30%;height:20px;padding:1%;text-color:white;text-decoration: underline;'>Expected Total: £ ${parseFloat(Math.round(total * 100) / 100).toFixed(2)}</div></br>`;
          message += `<div style='padding:10%,0%;font-weight: bold;'>The nearest Tesco to you is:</div></br> <div>${address[0]}</div></br><div>${address[1]}</div></br><div>${address[2]}</div><div style='width:30%;height:150px;padding:1%'><img width="600" src="http://maps.googleapis.com/maps/api/staticmap?center=${address[2]}&zoom=15&scale=false&size=600x300&maptype=roadmap&format=png&visual_refresh=true&markers=size:mid%7Ccolor:0xff0000%7Clabel:1%7C${address[2]}" alt="Google Map of ${address[2]}"></div>`;
          callbacktwo(message, productIDs);

        }
      }
    }

    ingredients.map(function(ingredient){
      var url = "https://dev.tescolabs.com/grocery/products/?query=" + ingredient[0] + "&offset=0&limit=1";
      setOptions(url, ingredient);
      request.get(options, ingredientBody);
    });
  },

  searchLocation: function(location, callback2){
    function locationBody(error, response, body){
      if(!error && response.statusCode == 200) {
        var info = JSON.parse(body);
        address.push(info.results[0].location.contact.address.lines[0].text)
        address.push(info.results[0].location.contact.address.town)
        address.push(info.results[0].location.contact.address.postcode.replace(' ', ''))
        // var postcode = info.results[0].location.contact.address.postcode.replace(' ', '');
        // console.log(address);
        callback2(address);
      }
    }
    var url = "https://dev.tescolabs.com/locations/search?offset=0&limit=1&sort=near:" + location + "&filter=isoCountryCode:GB";

    setOptions(url);
    request.get(options, locationBody);
  }
};
