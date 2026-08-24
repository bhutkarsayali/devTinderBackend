const express = require("express");
// require("./config/database");
const { connectToDB } = require("./config/database");

const app = express();

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
