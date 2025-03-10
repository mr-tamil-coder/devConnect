const validator = require("validator");
const validateSignupData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Name is not valid");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password is not strong enough");
  }
};

const  validateEditProfileData= (req) => {
  const allowEditFields = [
    "firstName",
    "lastName",
    "emailId",
    "age",
    "gender",
    "photoUrl",
    "about",
    "skills",
    "role",
  ];
  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowEditFields.includes(field)
  );

  return isEditAllowed;
};

module.exports = { validateSignupData,validateEditProfileData };
