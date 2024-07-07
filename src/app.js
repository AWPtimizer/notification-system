const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

app.use(cors());

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes imports
const authRouter = require('./routes/user.routes');
const notificationRouter = require('./routes/notification.routes');

// Routes declaration
app.use('/api/auth', authRouter)
app.use('/api/notifications', notificationRouter)

// setup swagger


module.exports = { app };