const crypto = require('crypto');
const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Config = require('../models/Config');

// Helper to get config value
const getConfig = async (key, defaultValue) => {
  const config = await Config.findOne({ key });
  return config ? config.value : defaultValue;
};


// @desc    Initiate PhonePe Payment
// @route   POST /api/payment/phonepe/initiate
// @access  Private
const initiatePhonePePayment = asyncHandler(async (req, res) => {
  const { orderId } = req.body;
  const order = await Order.findById(orderId);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  const merchantId = await getConfig('phonepe_merchant_id', process.env.PHONEPE_MERCHANT_ID || 'PGTESTPAYUAT');
  const saltKey = await getConfig('phonepe_salt_key', process.env.PHONEPE_SALT_KEY || '099eb0cd-02cf-4e2a-8aca-3e6c6aff0399');
  const saltIndex = await getConfig('phonepe_salt_index', process.env.PHONEPE_SALT_INDEX || '1');
  const baseUrl = await getConfig('phonepe_base_url', process.env.PHONEPE_BASE_URL || 'https://api-preprod.phonepe.com/apis/pg-sandbox');
  const callbackUrl = await getConfig('phonepe_callback_url', `${process.env.APP_URL || 'http://localhost:5000'}/api/payment/phonepe/callback`);
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';


  const payload = {
    merchantId,
    merchantTransactionId: `txn_${order._id}_${Date.now()}`,
    merchantUserId: order.user.toString(),
    amount: Math.round(order.totalPrice * 100), // in paisa
    redirectUrl: `${frontendUrl}/order/${order._id}`,
    redirectMode: 'POST',
    callbackUrl,
    paymentInstrument: {
      type: 'PAY_PAGE'
    }
  };

  const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
  const stringToSign = base64Payload + "/pg/v1/pay" + saltKey;
  const sha256Hash = crypto.createHash('sha256').update(stringToSign).digest('hex');
  const xVerify = sha256Hash + "###" + saltIndex;

  res.status(200).json({
    success: true,
    url: `${baseUrl}/pg/v1/pay`,
    payload: base64Payload,
    xVerify
  });
});

// @desc    PhonePe Callback
// @route   POST /api/payment/phonepe/callback
// @access  Public
const phonePeCallback = asyncHandler(async (req, res) => {
  const { response } = req.body;
  const decodedResponse = JSON.parse(Buffer.from(response, 'base64').toString('utf-8'));
  
  if (decodedResponse.success && decodedResponse.code === 'PAYMENT_SUCCESS') {
    const txnId = decodedResponse.data.merchantTransactionId;
    const orderId = txnId.split('_')[1];
    
    const order = await Order.findById(orderId);
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: decodedResponse.data.transactionId,
        status: decodedResponse.code,
        update_time: Date.now(),
        email_address: order.user.email
      };
      await order.save();
    }
  }
  
  res.status(200).send('OK');
});

module.exports = { initiatePhonePePayment, phonePeCallback };
