const { asyncHandler } = require("../utils/asyncHandler");
const Notification = require('../models/notification.model');
const {sendToQueue} = require('../utils/rabbitmq');

const createNotification = asyncHandler(async (req, res) => {
  const {userId, message} = req.body;
  if (!(userId || message)) {
    return res.status(400).json({message: "Invalid Credentials"})
  }

  const notification = await Notification.create({
    userId,
    message
  })

  // Pushing message to RabbitMQ queue
  await sendToQueue('notifications', JSON.stringify({
    id: notification._id,
    userId: notification.userId,
    message: notification.message,
    read: notification.read
  }))

  return res.status(200).json({message: "Notification created"}, notification);
});

// Get all notifications for authenticated user
const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ userId: req.user._id });

  res.json(notifications);
});

// Get a specific notification by ID
const getNotificationById = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (notification) {
    res.status(200).json({message: "Notification of the give Id are here."}, notification);
  } else {
    res.status(404);
    throw new Error('Notification not found');
  }
});

// Update a notification to mark as read
const updateNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (notification) {
    notification.read = true;
    await notification.save();
    res.status(200).json({message: "Notification updated successfully"}, notification);
  } else {
    res.status(404);
    throw new Error('Notification not found');
  }
});

module.exports = { createNotification, getNotifications, getNotificationById, updateNotification };