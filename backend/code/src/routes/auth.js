const express = require("express");
const authRouter = express.Router();
const { User } = require("../models/user");
const { validateSignupData } = require("../utils/validation");

//register API
authRouter.post("/register", async (req, res) => {
  try {
    validateSignupData(req);
    const { firstName, lastName, emailId, password } = req.body;
    const tempUser=new User();
    // encrypt the password
    const passwordHash = await tempUser.passwordHash(password);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();
    res.send("User registered");
  } catch (err) {
    res.status(404).send("Error in registering user " + err.message);
  }
});

//login API
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    console.log(emailId, password);
    
    // Find the user by emailId
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credintials");
      // throw new Error("User not found");
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await user.comparePassword(password);
    if (isPasswordValid) {
      //Create a JWT token.

      const token = await user.getJWT();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });
      res.send(user);
    } else {
      throw new Error("Invalid Credintials");
      // throw new Error("Invalid password");
    }
  } catch (err) {
    res.status(401).send("Error in login: " + err.message);
  }
});

//logout API
authRouter.post("/logout", (req, res) => {
  const token = req.cookies.token;
  if (token) {
    res.clearCookie("token");
    res.send("Logout successful");
  } else {
    res.send("You are already logged out");
  }
});

module.exports = { authRouter };
