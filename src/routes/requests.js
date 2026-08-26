const express = require("express");
const requestRouter = express.Router();

const { userAuth } = require("../middlewares/auth");

// post sendconnection request APP
requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user.firstName + " sent connection request");
  } catch (err) {
    res.status(400).send("Error sending the request:" + err.message);
  }
});
module.exports = requestRouter;
