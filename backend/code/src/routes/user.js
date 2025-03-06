const express = require("express");
const { userAuth } = require("../middlewares/auth");
const userRouter = express.Router();
const { connectionRequest } = require("../models/connectionRequest");
const { User } = require("../models/user");

userRouter.get("/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const pendingConnectionRequest = await connectionRequest
      .find({
        toUserId: loggedInUser._id,
        status: "interested",
      })
      .populate("fromUserId", "firstName lastName")
      .populate("toUserId", "firstName lastName")
      .lean();
    //.populate("fromUserId",["firstName", "lastName"])
    res.json(pendingConnectionRequest);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

userRouter.get("/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const loggedInUserId = loggedInUser._id;
    const acceptedConnectionRequest = await connectionRequest
      .find({
        $or: [
          {
            fromUserId: loggedInUserId,
            status: "accepted",
          },
          {
            toUserId: loggedInUserId,
            status: "accepted",
          },
        ],
      })
      .populate("fromUserId", "firstName lastName")
      .populate("toUserId", "firstName lastName")
      .lean();
    const data = acceptedConnectionRequest.map((data) => {
      if (data.fromUserId._id.toString() === loggedInUserId.toString()) {
        return data.toUserId;
      }
      return data.fromUserId;
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const loggedInUserId = loggedInUser._id;

    // Validate ObjectID format
    if (!mongoose.Types.ObjectId.isValid(loggedInUserId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    //find all connection requests (sent + received)
    const connectionRequests = await connectionRequest
      .find({
        $or: [{ fromUserId: loggedInUserId }, { toUserId: loggedInUserId }],
      })
      .select("fromUserId toUserId")
      .populate("fromUserId", "firstName lastName")
      .populate("toUserId", "firstName lastName")
      .lean();

    const excludeUsers = new Set();
    connectionRequests.forEach((connectionRequest) => {
      excludeUsers.add(connectionRequest.fromUserId._id.toString());
      excludeUsers.add(connectionRequest.toUserId._id.toString());
    });

    const users = await User.find({
      $and: [
        {
          _id: {
            $nin: Array.from(excludeUsers),
          },
        },
        {
          _id: {
            $ne: loggedInUser._id,
          },
        },
      ],
    })
      .select("firstName lastName")
      .limit(limit)
      .skip(skip)
      .lean();
    console.log("Hide User Feed ", users);
    res.send(users);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

module.exports = { userRouter };

/*
new ObjectId('679cdfd4ee19ae74226d0545'), ->MohanRaj
  new ObjectId('679ce43c0e977c74dd059600'),-> Raja Raj 
  new ObjectId('679f1a1ef089d0fd856728e0'), -> Shyam raj
  new ObjectId('679cdfd4ee19ae74226d0545'),->Mohan Raj
  new ObjectId('679f1a16f089d0fd856728dd'), -> surjith
  new ObjectId('679f1a08f089d0fd856728d7') -> santhosh

*/
