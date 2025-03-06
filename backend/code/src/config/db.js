const mongoose = require("mongoose");
const mongodbAtlas =  
  "mongodb+srv://MohanRaj:ASDFLKJ123@mohanraj.cnxah.mongodb.net/VinothNode";
const mongodbLocal = "mongodb://127.0.0.1:27017/VinothNode";
const connectDb = async () => {
  await mongoose.connect(mongodbAtlas);
};
module.exports = { connectDb };
