const express = require('express');
const router = express.Router();
const { initiatePhonePePayment, phonePeCallback } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/phonepe/initiate', protect, initiatePhonePePayment);
router.post('/phonepe/callback', phonePeCallback);

module.exports = router;
