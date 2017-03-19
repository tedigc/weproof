import validator from 'validator';
import isEmpty   from 'lodash/isEmpty';

export default function validateInput(data) {
  let errors = {};

  // Username validation
  if(validator.isEmpty(data.username)) {
    errors.username = "Username is required.";
  }
  
  // E-mail validation
  if(!validator.isEmail(data.email)) {
    errors.email = "E-mail is invalid.";
  }
  if(validator.isEmpty(data.email)) {
    errors.email = "E-mail is required.";
  }

  // Password
  if(validator.isEmpty(data.password)) {
    errors.password = "Password is required.";
  }

  // Password confirmation
  if(!validator.equals(data.password, data.passwordConfirm)) {
    errors.passwordConfirm = "Passwords must match";
  }
  if(validator.isEmpty(data.passwordConfirm)) {
    errors.passwordConfirm = "Password Confirmation is required.";
  }

  return {
    errors,
    isValid : isEmpty(errors)
  }
}