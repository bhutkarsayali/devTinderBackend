const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 50,
    },
    lastName: {
      type: String,
      minLength: 2,
      maxLength: 50,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is not valid");
        }
      },
    },
    password: {
      type: String,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter a strong password");
        }
      },
    },
    gender: {
      type: String,
      lowercase: true,
      enum: {
        values: ["male", "female", "other"],
        message: "{VALUE} is not a valid gender type",
      },
      // validate(value) {
      //   if (!["male", "female", "other"].includes(value)) {
      //     throw new Error("Gender data is not valid");
      //   }
      // },
    },
    age: {
      type: Number,
      min: 18,
      max: 50,
    },
    photoURL: {
      type: String,
      default:
        "https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Photo URL is not valid");
        }
      },
    },
    about: {
      type: String,
      default: "This is default about info!",
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true },
);

userSchema.index({ firstName: 1 });
userSchema.index({ gender: 1 });

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "Dev@Tinder$790", {
    expiresIn: "1d",
  });
  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;
  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash,
  );
  return isPasswordValid;
};

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
