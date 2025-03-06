const mongoose = require("mongoose");
const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is incorrect status.`,
      },
    },
  },
  {
    timestamps: true,
  }
);

//validate the self connection request
connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;
  //check fromUserId and toUserId values are same
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("Cannot send connection request to yourself ");
  }
  next();
});

//connectionRequest.
//creating index for optimization
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

const connectionRequest = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = { connectionRequest };
