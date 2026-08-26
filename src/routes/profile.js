const express = require("express");
const profileRouter = express.Router();

const { userAuth } = require("../middlewares/auth");

// get profile API = using validations from middleware
profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    console.log("User:" + user);
    res.send(user);
  } catch (err) {
    res.status(400).send("Error sending the request:" + err.message);
  }
});
module.exports = profileRouter;
