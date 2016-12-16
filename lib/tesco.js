var email = require('./email')


module.exports = {
  searchIngredients: function(ingredient, numberOfIngredients){
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
        // iterator += 1
        // if (iterator === numberOfIngredients) {
        //   email.sendEmail(message);
        // }
      }
    }
    request.get(options, callback);
  }
}
