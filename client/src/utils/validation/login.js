import validator from 'validator';
import isEmpty   from 'lodash/isEmpty';

export default function validateInput(data) {
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