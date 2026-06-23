const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { initiatePayment, paymentWebhook } = require('../controllers/paymentController');

router.post('/initiate', authMiddleware, initiatePayment);
router.post('/webhook', paymentWebhook);

module.exports = router;