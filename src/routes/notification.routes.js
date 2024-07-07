const express = require('express');
const { createNotification, getNotifications, getNotificationById, updateNotification } = require('../controllers/notification.controller');

const router = express.Router();

router.post('/', createNotification);
router.get('/', getNotifications);
router.get('/:id', getNotificationById);
router.put('/:id', updateNotification);

module.exports = router;