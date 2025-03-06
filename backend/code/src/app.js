const express = require("express");
const app = express();
const { connectDb } = require("./config/db");
const cookieParser = require("cookie-parser");
const cors = require("cors");
//Auth Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

const { authRouter } = require("./routes/auth");
const { requestRouter } = require("./routes/request");
const { profileRouter } = require("./routes/profile");
const { userRouter } = require("./routes/user");

app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/request", requestRouter);
app.use("/user", userRouter);
connectDb()
  .then(() => {
    console.log("Database connected");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.error("Db cannot be connected");
  });
