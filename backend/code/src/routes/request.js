const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { connectionRequest } = require("../models/connectionRequest");
const { User } = require("../models/user");
const mongoose = require("mongoose");

// Send Connection Request
requestRouter.post("/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const { toUserId, status } = req.params;

    // Validate Status
    const allowedStatus = ["interested", "ignored"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: `Invalid status type: ${status}` });
    }

    // Validate toUserId
    if (!mongoose.isValidObjectId(toUserId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    // Prevent Sending Request to Self
    if (fromUserId.equals(toUserId)) {
      return res.status(400).json({ message: "Cannot send request to yourself" });
    }

    // Check if User Exists [used Lean]
    const toUser = await User.findById(toUserId).lean(); 
    if (!toUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent Duplicate Requests
    const existingConnectionRequest = await connectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    }).lean();
    if (existingConnectionRequest) {
      return res.status(400).json({ message: "Connection request already exists" });
    }

    // Create and Save Connection Request
    const connectionReq = new connectionRequest({ fromUserId, toUserId, status });
    const connectionReqData = await connectionReq.save();

    res.status(201).json({
      message: `${req.user.firstName} is ${status} in ${toUser.firstName}`,
      connectionReqData,
    });
  } catch (err) {
    console.error("Error in sending request:", err.message);
    res.status(500).json({ message: "Server error while sending request" });
  }
});

// Review Connection Request
requestRouter.post("/review/:status/:requestId", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { requestId, status } = req.params;

    // Validate Status
    const allowedStatus = ["accepted", "rejected"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status type" });
    }

    // Validate requestId
    if (!mongoose.isValidObjectId(requestId)) {
      return res.status(400).json({ message: "Invalid request ID format" });
    }

    // Find Connection Request
    const connectionReq = await connectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: "interested",
    });
    
    // Check if Connection Request Exists
    if (!connectionReq) {
      return res.status(404).json({ message: "Connection request not found or not in 'interested' state" });
    }

    // Update and Save Connection Request Status
    connectionReq.status = status;
    const data = await connectionReq.save();

    res.json({
      message: `Connection request has been ${status}`,
      data,
    });
  } catch (err) {
    console.error("Error in reviewing request:", err.message);
    res.status(500).json({ message: "Server error while reviewing request" });
  }
});

module.exports = { requestRouter };
