const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../model/connectionRequest");
const userRouter = express.Router();
const USER_SAFE_DATA = "firstName lastName photoURL age about gender skills";

// GET all pending connection requests for the loggedIn user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    // query/database call
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate(
      "fromUserId",
      "firstName lastName photoURL age about gender skills",
    );
    // }).populate("fromUserId", ["firstName", "lastName"]);

    res.json({
      message: "Data fetched successfully",
      data: connectionRequests,
    });
  } catch (err) {
    res.status(400).send("Error Occured" + err.message);
  }
});

module.exports = userRouter;
