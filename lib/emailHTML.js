module.exports = {
  productPrice: function(image, imageRef, name, price, quantity){
    return `<div style='margin:5px;display:inline-block;font-family:Verdana;width:90%;height:100px;padding:1%;border-bottom:solid;border-color:gray;border-width:1px;'><div><img src=${image}></img></div><div><a href="${imageRef}&newSort=true&search=Search">add to cart</a></div><div style='position:relative;text-align:center;bottom:50%;'>` + name + " - £" + price + `</div><div style='position:relative;text-align:right;bottom:80%;'><div style='position:relative;text-align:right;bottom:50%;'>${quantity}</div></br><input type='checkbox' id='cbox1' value='first_checkbox' style='zoom:2';></div></br>`
  },

  orderTotal: function(total){
     return `<div style='margin:3px;display:inline-block;font-family:Verdana;width:30%;height:20px;padding:1%;text-color:white;text-decoration: underline;'>Expected Total: £ ${total}</div></br>`;
  },

  locationMap: function(address){
     return `<div style='padding:10%,0%;font-weight: bold;'>The nearest Tesco to you is:</div></br> <div>${address[0]}</div></br><div>${address[1]}</div></br><div>${address[2]}</div><div style='width:30%;height:150px;padding:1%'><img width="600" src="http://maps.googleapis.com/maps/api/staticmap?center=${address[2]}&zoom=15&scale=false&size=600x300&maptype=roadmap&format=png&visual_refresh=true&markers=size:mid%7Ccolor:0xff0000%7Clabel:1%7C${address[2]}" alt="Google Map of ${address[2]}"></div>`;
  }
};
