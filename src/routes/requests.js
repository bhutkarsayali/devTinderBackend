const express = require("express");
const requestRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const User = require("../model/user");
const ConnectionRequest = require("../model/connectionRequest");

// post sendconnection request APP
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res, next) => {
    try {
      const user = req.user;
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid Status Type : " + status });
      }

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({ message: "User Not Found!!" });
      }

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          {
            fromUserId: toUserId,
            toUserId: fromUserId,
          },
        ],
      });

      if (existingConnectionRequest) {
        return res
          .status(400)
          .send({ message: "Connection Request Already Exists!!" });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();
      // res.send(user.firstName + " sent connection request");
      res.json({
        message:
          user.firstName.toUpperCase() +
          " is " +
          status +
          " (sent connection request) in " +
          toUser.firstName.toUpperCase(),
        data,
      });
    } catch (err) {
      next(err); // pass error to global error handler
      // res.status(400).send("Error sending the request:" + err.message);
    }
  },
);

// post API for review request
requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;
      console.log("req === " + req);

      // Validate the sataus
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Status Not Allowed" });
      }

      // Akshay => sent connection req to Elon
      // loggedInUser == toUserId
      // status == interested
      // requestId should be valid
      // writing a query find request in db where id =  requestId, toUserId = loggedin user id and status is "interested"
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser,
        status: "interested",
      });

      if (!connectionRequest) {
        return res
          .status(400)
          .json({ message: "Connection Request Not Found" });
      }
      // pushing status to "accepted/rejected" from allowedlist
      connectionRequest.status = status;

      const data = await connectionRequest.save();

      res.json({message: "Connection request " + status, data})
    } catch (err) {
      res.status(400).send("Error sending the request:" + err.message);
    }
  },
);

module.exports = requestRouter;
