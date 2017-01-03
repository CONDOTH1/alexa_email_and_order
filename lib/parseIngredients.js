var fixedMappedArray = [];
var mappedArray = [];
var removeWords = [
  'KRAFT',
  'Original',
  'HEINZ',
  'oil-packed'
];

function removeBrands(ingredient){
  var fixedIngredient = ingredient[0];
  removeWords.forEach(function(word){
      fixedIngredient = fixedIngredient.replace(word, '').trim();
    });
  return [fixedIngredient, ingredient[1]];
}

module.exports = {
   parseIngredients: function(recipeJSON, callback){
    var details = recipeJSON.IngredientDetails;
    details.map(function(element) {
      mappedArray.push([element.IngredientName, element.QuantityText + " " + element.QuantityUnit]);
    });
    fixedMappedArray = mappedArray.map(function(ingredient){return removeBrands(ingredient); });
    return fixedMappedArray;
  },
};
