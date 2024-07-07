// controllers/auth.controller.js
const User = require("../models/user.model");
const {asyncHandler} = require("../utils/asyncHandler");

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) {
    return res
      .status(400)
      .json({ message: "Username or email already exists" });
  }
  const user = await User.create({ username, email, password });
  const token = user.generateAuthToken();
  const createdUser = await User.findById(user._id).select("-password");
  res
    .status(200)
    .json({ message: "User registered successfully" }, { createdUser, token });
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  if (!username) {
    return new res.status(400).json({ message: "username is required" });
  }

  const user = await User.findOne({ username });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const loggedInUser = user.select("-password")
  const token = user.generateAuthToken();
  res.status(200).json({message: "Logged in successfully"},{ loggedInUser, token });
});

module.exports = {
  registerUser,
  loginUser,
};
