const express = require("express");
const { connectToDB } = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

//global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(400).json({ error: err.message });
});

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
