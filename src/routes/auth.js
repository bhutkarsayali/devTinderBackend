const express = require("express");
const authRouter = express.Router();

const { validateSignUpData } = require("../utils/validations");
const User = require("../model/user");
const bcrypt = require("bcrypt");

authRouter.post("/signup", async (req, res) => {
  try {
    //validation of data
    validateSignUpData(req);
    const { firstName, lastName, emailId, password, photoUrl, age, skills } =
      req.body;

    // Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);

    // const user1 = new User(req.body);
    const user1 = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      photoUrl,
      age,
      skills,
    });
    const skillsArr = req.body.skills;
    const MAX_ITEMS = 5;

    if (skillsArr.length > MAX_ITEMS) {
      return res.status(400).send(`You can only add up to ${MAX_ITEMS} skills`);
    }

    await user1.save();
    res.send("Data added successfully");
  } catch (err) {
    res.status(400).send("Error sending the request:" + err.message);
  }
});

//login API
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    //check if email id is present in db
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Email id is not present in DB");
    }

    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      const token = await user.getJWT();

      //Add the token to cookie and send it back to the user

      //cookie expires in 8 hours
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
        httpOnly: true,
      });
      res.send("Login Successful");
    } else {
      throw new Error("Password is not correct");
    }
  } catch (err) {
    res.status(400).send("Error sending the request:" + err.message);
  }
});

//logout API
authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("User logged out");
});
module.exports = authRouter;
