const express = require("express");
// require("./config/database");
const { connectToDB } = require("./config/database");
const app = express();
const User = require("./model/user");

app.post("/signup", async (req, res) => {
  const user = new User({
    firstName: "Sayali",
    lastName: "Bhtkar",
    emailId: "Bhtkar@gmail.com",
    password: "Bhtkarsayali",
  });

  try {
    await user.save();
    res.send("Data added successfully");
  } catch (err) {
    res.status(400).send("Error sending the request:" + err.message);
  }

});

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
