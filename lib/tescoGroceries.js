require('dotenv').config();
var request = require('request');
var formData = {
  'version':	'2.0',
  'username':	process.env.EMAIL,
  'password':	process.env.TESCOPASS,
  'grant_type': 'password',
  'client_secret':	process.env.TESCOSECRET,
  'client_id':	process.env.TESCOID,
};

var getCollectionOtions = {
  url: 'https://mobile.tesco.com/groceryapi/restservice.aspx?COMMAND=GETCOLLECTIONPOINTADDRESS&version=2.0&virtualstoreid=7091&PostCode=EC1Y%202AL&sessionkey=WDCc9317674b48caa44cc5ad831052b3qeCNSamnnrwzoSN4pR',
  type: "GET",
  headers: {
    'Host': 'mobile.tesco.com'
  }
};

var chooseCollectionOtions = {
  url: 'https://mobile.tesco.com/groceryapi/restservice.aspx?COMMAND=CHOOSECOLLECTIONSLOT&version=2.0&CollectionSlotId=70912016122809000020161228110000%7C0.00&virtualstoreid=7091&PostCode=E3%203DA&sessionkey=WDCc9317674b48caa44cc5ad831052b3qeCNSamnnrwzoSN4pR',
  type: "GET",
  headers: {
    'Host': 'mobile.tesco.com'
  }
};

module.exports = {
  login: function(callback){
    request.post({url:"https://mobile.tesco.com/groceryapi/restservice.aspx?COMMAND=TOKEN&grant_type=password&Client_Secret=da6CF8PP8xni65eudmEX&Client_ID=AB37EB44DF1AC07531E5&version=2.0&username=" + process.env.EMAIL + "&password=" + process.env.TESCOPASS, formData: formData}, function optionalCallback(err, httpResponse, body) {
    if (err) {
        return console.error('upload failed:', err);
      }
        var info = JSON.parse(body);
        console.log(body);
      setTimeout(function(){
        callback(info.access_token);
      }, 5000);
    });
  },

  addProduct: function(productID, sessionkey){
    console.log(productID);
    console.log(sessionkey);
    var addProductOptions = {
      url:`https://mobile.tesco.com/groceryapi/restservice.aspx?COMMAND=CHANGEBASKET&PRODUCTID=&CHANGEQUANTITY=0&version=2.0&SURCHARGEMSG=Y&GETLINEITEMS=Y&MULTIADD=Y&PRODUCTIDSWITHQUANTITIES=${productID}~1&sessionkey=${sessionkey}`,
      type: "GET",
      headers: {
        'Host': 'mobile.tesco.com'
      }
    };

    function callback(error, response, body) {
      // console.log(response.statusCode);
      // console.log(error);
      if (!error && response.statusCode == 200) {
        // console.log(body);
      }
    }
    request(addProductOptions, callback);
  },

  getCollectionLocation: function(){
    function callback(error, response, body) {
      console.log(response.statusCode);
      console.log(error);
      if (!error && response.statusCode == 200) {
        console.log(body);
      }
    }
    request(getCollectionOtions, callback);
  },

  chooseCollectionLocation: function() {
    function callback(error, response, body) {
      console.log(response.statusCode);
      console.log(error);
      if (!error && response.statusCode == 200) {
        console.log(body);
      }
    }
    request(chooseCollectionOtions, callback);
  },

  readyForCheckout: function(sessionkey) {
    var readyForCheckoutOtions = {
      url: `https://mobile.tesco.com/groceryapi/restservice.aspx?COMMAND=READYFORCHECKOUT&version=2.0&sessionkey=${sessionkey}`,
      type: "GET",
      headers: {
        'Host': 'mobile.tesco.com'
      }
    };

    function callback(error, response, body) {
      console.log(response.statusCode);
      console.log(error);
      if (!error && response.statusCode == 200) {
        console.log(body);
      }
    }
    request(readyForCheckoutOtions, callback);
  },

  logout: function(sessionkey) {
    var logoutOptions = {
      url: `https://mobile.tesco.com/groceryapi/restservice.aspx?COMMAND=LOGOUT&version=2.0&sessionkey=${sessionkey}`,
      type: "GET",
      headers: {
        'Host': 'mobile.tesco.com'
      }
    };
    function callback(error, response, body) {
      console.log(response.statusCode);
      console.log(error);
      if (!error && response.statusCode == 200) {
        console.log(body);
      }
    }
    request(logoutOptions, callback);
  }
};
