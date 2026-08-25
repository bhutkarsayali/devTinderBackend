const express = require("express");
// require("./config/database");
const { connectToDB } = require("./config/database");
const app = express();
const User = require("./model/user");

app.use(express.json());

app.post("/signup", async (req, res) => {
  /** creating a new instance of a user model and adding data to db */
  // const user = new User({
  //   firstName: "Sayali",
  //   lastName: "Bhtkar",
  //   emailId: "Bhtkar@gmail.com",
  //   password: "Bhtkarsayali",
  // });

  /**adding data coming from postman or UI anyone outside the server, dynamically to db */
  console.log(req.body);
  const user1 = new User(req.body);

  try {
    // await user.save();
    await user1.save();
    res.send("Data added successfully");
  } catch (err) {
    res.status(400).send("Error sending the request:" + err.message);
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
app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;
  try {
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
      new: true, // 3. Return the updated doc, not the old one
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
    app.listen(3000, () => {
      console.log("Server is successfully listening to port 3000");
    });
  })
  .catch((err) => {
    console.error("Not connected to DB");
  });

// app.listen(3000, () => {
//   console.log("Server is successfully listening to port 3000");
// });
