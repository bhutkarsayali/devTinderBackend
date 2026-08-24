const express = require("express");
const app = express();

//this will only handle get call to /user
// /:xyz means dynamic route
// app.get("/user/:userId/:name/:password", (req, res) => {
//     // console.log(req.query)
//     console.log(req.params)
//   res.send({ firstName: "Sayali", lastname: "B" });
// });

// app.post("/user", (req, res) => {
//   //Saving data to DB : write logic for this here
//   res.send("Data successfully saved to DB : Saving data to DB");
// });

// app.delete("/user", (req, res) => {
//   //Delete
//   res.send("Deleted Successfully");
// });

// app.use("/user", (req, res) => {
//   res.send("HAHAHAHAHA");
// });

// this will match alll the HTTP method API calls to /test
// app.use("/test", (req, res) => {
//   res.send("Hello from  testserver");
// });
// app.use("/hello", (req, res) => {
//   res.send("Hello hello hello");
// });

// app.use("/", (req, res) => {
//   res.send("Hello Sayali");
// });

// app.use(
//   "/user",
//   (req, res, next) => {
//     next();
//     res.send("HAHAHAHAHA 1");

//   },
//   (req, res, next) => {
//     res.send("HAHAHAHAHA 2");
//     next();
//   },
// );

/** MIDDLEWARE CODE */
const { adminAuth, userAuth } = require("./middlewares/auth.js");

// Handling auth middleware for all admin and user requests
app.use("/admin", adminAuth);

app.get("/user/data", userAuth, (req, res) => {
  res.send("User Data Sent");
});

// user/login does not require auth, anybody can log in so ne need to use userAuth here
app.post("/user/login", (req, res) => {
  res.send("User Loggen in successsfully");
});

app.get("/admin/getAllUserData", (req, res) => {
  res.send("All Data Sent");
});

/**ERROR HANDLING */

app.use("/", (err, req, res, next) => {
  if (err) {
    // Log your error
    res.status(500).send("Something went wrong");
  }
});
app.use("/getUserData", (req, res, next) => {
  try {
    throw new Error("Something went wrong");
    res.send("Hello hello hello");
  } catch (err) {
    res.status(500).send("Something went wrong in getUserData, contact support");
  }
});
// app.use("/", (err, req, res, next) => {
//   if (err) {
//     // Log your error
//     res.status(500).send("Something went wrong");
//   }
// });

app.listen(3000, () => {
  console.log("Server is successfully listening to port 3000");
});
