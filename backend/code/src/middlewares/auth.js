const jwt = require("jsonwebtoken");
const {User}=require("../models/user")
const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Token is not valid");
    }
    const decodedObj = await jwt.verify(token, "nanThandaLeo");
    const { _id } = decodedObj;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }
    //attach the req to user
    req.user = user;
    next();
  } catch (err) {
    res.status(401).send("Error in login: " + err.message);
  }
};

module.exports = { userAuth };
