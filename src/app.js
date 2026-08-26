const express = require("express");
// require("./config/database");
const { connectToDB } = require("./config/database");
const app = express();
const User = require("./model/user");
const { validateSignUpData } = require("./utils/validations");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  /** creating a new instance of a user model and adding data to db */
  // const user = new User({
  //   firstName: "Sayali",
  //   lastName: "Bhtkar",
  //   emailId: "Bhtkar@gmail.com",
  //   password: "Bhtkarsayali",
  // });

  /**adding data coming from postman or UI anyone outside the server, dynamically to db */
  // console.log(req.body);
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
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    //check if email id is present in db
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Email id is not present in DB");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      //Create JWT Token
      const token = await jwt.sign({ _id: user._id }, "Dev@Tinder$790", {
        expiresIn: "1d",
      });

      //Add the token to cookie and send it back to the user
      // res.cookie("token", "randomtokenabczyz");

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

// get profile API = using validations from middleware
app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    console.log("User:" + user);
    res.send(user);
  } catch (err) {
    res.status(400).send("Error sending the request:" + err.message);
  }
});

// post sendconnection request APP
app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user.firstName + " sent connection request");
  } catch (err) {
    res.status(400).send("Error sending the request:" + err.message);
  }
});

/** Update user in database */

connectToDB()
  .then(() => {
    console.log("DB connection established successfully");
    app.listen(3000, () => {
      console.log("Server is successfully listening to port 3000");
    });
  })
  .catch((err) => {
    console.error("Not connected to DB: " + err.message);
  });

// app.listen(3000, () => {
//   console.log("Server is successfully listening to port 3000");
// });
