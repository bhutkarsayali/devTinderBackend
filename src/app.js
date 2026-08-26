const express = require("express");
// require("./config/database");
const { connectToDB } = require("./config/database");
const app = express();
const User = require("./model/user");
const { validateSignUpData } = require("./utils/validations");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

app.use(express.json());
app.use(cookieParser);

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
      const token = await jwt.sign({ _id: user._id }, "Dev@Tinder$790");

      //Add the token to cookie and send it back to the user
      // res.cookie("token", "randomtokenabczyz");
      res.cookie("token", token);
      res.send("Login Successful");
    } else {
      throw new Error("Password is not correct");
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

//get profile API
app.get("/profile", async (req, res) => {
  try {
    //validate the cookie
    const cookies = req.cookies;
    console.log(cookies);

    const { token } = cookies;
    //validate the token and handle error cases
    if(!token){
      throw new Error("Token is not valid")
    }
    const decodedMessage = await jwt.verify(token, "Dev@Tinder$790");
    console.log(decodedMessage);
    const { _id } = decodedMessage;
    console.log("LoggedIn User is: " + _id);

    const user = await User.findById(_id)
    if(!user){
      throw new Error("User does not exists")
    }
    // res.send("Reading Cookies");
    res.send(user);
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

/** Get one user by Email */
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const users = await User.find({ emailId: userEmail });
    if (users.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

/** Get all users by Email */
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

/** Update user by userId from database */
app.patch("/user/:userId", async (req, res) => {
  // const userId = req.body.userId;
  const userId = req.params?.userId;
  const data = req.body;
  try {
    //API level data sanitization, updates are allowed for mentioned data only
    const ALLOWED_UPDATES = ["photoURL", "about", "gender", "age", "skills"];

    /**data= req.body: {
        firstName: "Sayali",
        lastName: "Bhtkar",
        emailId: "Bhtkar@gmail.com",
        password: "Bhtkarsayali",
      } */
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k),
    );
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }

    // const users = await User.findByIdAndDelete({userId:userId}); both can work
    await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true,
    });
    res.send("User updated successfully");
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

/** Update user by emailId from database */
app.patch("/user", async (req, res) => {
  const userEmailId = req.body.emailId;
  const data = req.body;
  try {
    // const users = await User.findByIdAndDelete({userId:userId}); both can work
    await User.findOneAndUpdate({ emailId: userEmailId }, data, {
      returnDocument: "after", // 3. Return the updated doc, not the old one
      runValidators: false, // 4. Force Mongoose schema validation
    });
    res.send("User updated successfully");
  } catch (err) {
    res.status(400).send("Update Failed" + err.message);
  }
});

/** Update user in database */

connectToDB()
  .then(() => {
    console.log("DB connection established successfully");
    app.listen(7777, () => {
      console.log("Server is successfully listening to port 7777");
    });
  })
  .catch((err) => {
    console.error("Not connected to DB");
  });

// app.listen(7777, () => {
//   console.log("Server is successfully listening to port 7777");
// });
