const Validator = require("validator");
const isEmpty = require("is-empty");
module.exports = function validateRegisterInput(data) {
  let errors = {};
// Convert empty fields to an empty string so we can use validator functions
  data.username = !isEmpty(data.username) ? data.username : "";
  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.phno = !isEmpty(data.phno) ? data.phno : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";

  if (Validator.isEmpty(data.username)) {
    errors.username = "Username field is required";
  }
// Name checks
  if (Validator.isEmpty(data.name)) {
    errors.name = "Name field is required";
  }
// Email checks
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  } else if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }

  var phRE = new RegExp("^[7-9][0-9]{9}$");
  if (Validator.isEmpty(data.phno)) {
    errors.phno = "Phone Number field is required";
  } else if (!phRE.test(data.phno)) {
    errors.phno = "Phone Number is invalid";
  }
  
// Password checks
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }

if (Validator.isEmpty(data.password2)) {
    errors.password2 = "Confirm password field is required";
  }
if (!Validator.isLength(data.password, { min: 8, max: 30 })) {
    errors.password = "Password must be at least 8 characters";
  }
if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = "Password and Confirm Password must match";
  }
return {
    errors,
    isValid: isEmpty(errors)
  };
};