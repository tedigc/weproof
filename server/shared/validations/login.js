var validator = require('validator');
var isEmpty   = require('lodash/isEmpty');

module.exports = function validateInput(data) {
  var errors = {};

  // Identifier validation
  if(validator.isEmpty(data.identifier)) {
    errors.identifier = "This field is required.";
  }

  // Password validation
  if(validator.isEmpty(data.password)) {
    errors.password = "This field is required.";
  }

  return {
    errors,
    isValid : isEmpty(errors)
  }
}