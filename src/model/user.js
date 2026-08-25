const mongoose = require("mongoose");
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
    },
    password: {
      type: String,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("Gender data is not valid");
        }
      },
    },
    age: {
      type: String,
      min: 18,
      max: 50,
    },
    photoURL: {
      type: String,
      default:
        "https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG.png",
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

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
