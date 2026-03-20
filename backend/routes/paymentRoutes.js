const express = require('express');
const router = express.Router();
const { initiatePhonePePayment, phonePeCallback, handlePhonePeRedirect, checkPhonePeStatus } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/phonepe/initiate', protect, initiatePhonePePayment);
router.get('/phonepe/status/:orderId', protect, checkPhonePeStatus);
router.post('/phonepe/callback', phonePeCallback);
router.all('/phonepe/redirect', handlePhonePeRedirect);

module.exports = router;
