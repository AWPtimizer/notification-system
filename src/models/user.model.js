const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const userSchema = mongoose.Schema({
  id: {
    type: String,
    default: uuidv4
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  connected: {
    type: Boolean,
    default: false,
  },
  roles: {
    // This will add role field
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});

userSchema.pre('save', async function(next) {
  try {
    if (!this.isModified('password')) {
      return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    return next();
  } catch (error) {
    return next(error);
  }
});

userSchema.methods.isPasswordCorrect = async function(password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error(error);
  }
};

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    {
      _id: this._id,
      username: this.username,
      email: this.email,
      roles: this.roles
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' } 
  );
  return token;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
