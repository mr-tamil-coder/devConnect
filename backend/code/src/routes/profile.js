const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");

//find the profile
profileRouter.get("/", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(404).send("Token is invalid");
  }
});

profileRouter.patch("/edit", userAuth, async (req, res) => {
  //Data sanitization or Data validation..
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid data");
    }
    const loggedInUser = req.user;

    //edit the value of loggedin user..Its object one we change in one place it will be updated
    //loggedInUser.firstName=req.body.firstName;
    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
    });
    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName} Profile edited successfully`,
      data:loggedInUser,
    });
  } catch (err) {
    res.send("Error in editing profile" + err.message);
  }
});
module.exports = { profileRouter };
