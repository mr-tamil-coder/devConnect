const express = require("express");
const { userAuth } = require("../middlewares/auth");
const userRouter = express.Router();
const { connectionRequest } = require("../models/connectionRequest");
const { User } = require("../models/user");
const { mongoose } = require("mongoose");
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

    // Find all connection requests (sent + received)
    const connectionRequests = await connectionRequest
      .find({
        $or: [
          { fromUserId: loggedInUserId }, 
          { toUserId: loggedInUserId }
        ],
      })
      .lean();

    // Create a Set of user IDs to exclude (users you already have a connection with)
    const excludeUsers = new Set();
    
    // Add the logged in user's ID to the exclude list
    excludeUsers.add(loggedInUserId.toString());
    
    // Add all users from connection requests to exclude list
    connectionRequests.forEach((request) => {
      excludeUsers.add(request.fromUserId.toString());
      excludeUsers.add(request.toUserId.toString());
    });
    
    // Convert the Set to an array of ObjectIds for the query
    const excludeUserIds = Array.from(excludeUsers).map(id => 
      mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : id
    );
    
    console.log("Excluded User IDs:", excludeUserIds);
    console.log("Logged In User ID:", loggedInUserId.toString());
    
    // Find users who are not in the exclude list
    const users = await User.find({
      _id: { $nin: excludeUserIds }
    })
      .select("firstName lastName emailId age gender photoUrl about skills role")
      .limit(limit)
      .skip(skip)
      .lean();
    
    console.log("User Feed Results:", users);
    
    // Check if feed is empty
    if (users.length === 0) {
      return res.json({ message: "No new users found for your feed" });
    }
    
    res.json(users);
  } catch (err) {
    console.error("Feed API Error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
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
