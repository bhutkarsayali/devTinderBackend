const express = require("express");
const profileRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validations");

// get profile API = using validations from middleware
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    console.log("User:" + user);
    res.send(user);
  } catch (err) {
    res.status(400).send("Error sending the request:" + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      // return res.status(400).send("");
      throw new Error("Invalid edit request");
    }

    const loggedInUser = req.user;
    console.log(loggedInUser);
    // loggedInUser.firstName = req.body.firstName
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    console.log(loggedInUser);
    await loggedInUser.save();
    // res.send(`${loggedInUser.firstName}, your Edit was successful`);
    res.json({
      message: `${loggedInUser.firstName}, your Edit was successful`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("Error sending the request:" + err.message);
  }
});

module.exports = profileRouter;
