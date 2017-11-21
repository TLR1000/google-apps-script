String.prototype.toProperCase = function () {
//Function to return all words in a string capitalized
  //usage: 'the string'.toProperCase();
/* 
https://www.w3schools.com/jsref/jsref_obj_regexp.asp
https://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript/196991#196991
*/
      return this.replace(/\b\w+/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};
