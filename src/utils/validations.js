const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Please enter valid Name");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Please enter valid Email");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter strong Password");
  }
};

const validateEditProfileData = (req) => {
  const allowedFields = [
    "firstName",
    "lastName",
    "emailId",
    "photoURL",
    "about",
    "gender",
    "age",
    "skills",
    "about",
  ];

  const isEditAllowed = Object.keys(req.body).every((k) =>
    allowedFields.includes(k),
  );

  return isEditAllowed;
};
module.exports = { validateSignUpData, validateEditProfileData };
