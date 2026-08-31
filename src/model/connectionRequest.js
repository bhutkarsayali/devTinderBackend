const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      required: true,

      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: "{VALUE} is not a valid gender type",
      },
    },
  },
  {
    timestamps: true,
  },
);

//compound index
// connectionRequestSchema.find({ fromUserId: 545234324342, toUserId: 43424232323 });
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

// connectionRequestSchema.pre("save", function (next) {
//   const connectionRequest = this;
//   //Check if the fromUserId is same as toUserId , this user id is objectId so parse them before use
//   if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
//     throw new Error("Cannot send connection request to yourself!!");
//   }
//   // this is kind of middleware, so alwayscall nex method here
//   next();
// });

// connectionRequestSchema.pre("save", function (next) {
//   const { fromUserId, toUserId } = this;

//   if (fromUserId.equals(toUserId)) {
//     return next(new Error("Cannot send connection request to yourself!"));
//   }

//   next();
// });

connectionRequestSchema.pre("save", async function () {
  if (this.fromUserId.equals(this.toUserId)) {
    throw new Error("Cannot send connection request to yourself!");
  }
});

const connectionRequestModel = new mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema,
);

module.exports = connectionRequestModel;
