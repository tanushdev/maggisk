const crypto = require('crypto');
const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Config = require('../models/Config');

// Helper to get config value
const getConfig = async (key, defaultValue) => {
  const config = await Config.findOne({ key });
  return config ? config.value : defaultValue;
};

const axios = require('axios');

// Helper to join URLs safely
const joinUrl = (base, path) => {
  const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const cleanPath = path.startsWith('/') ? path : '/' + path;
  return cleanBase + cleanPath;
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

  const merchantId = await getConfig('phonepe_merchant_id', process.env.PHONEPE_MERCHANT_ID);
  const saltKey = await getConfig('phonepe_salt_key', process.env.PHONEPE_SALT_KEY);
  const saltIndex = await getConfig('phonepe_salt_index', process.env.PHONEPE_SALT_INDEX || '1');
  const baseUrl = await getConfig('phonepe_base_url', process.env.PHONEPE_BASE_URL);
  const backendUrl = process.env.APP_URL || 'http://localhost:5000';
  const callbackUrl = await getConfig('phonepe_callback_url', `${backendUrl}/api/payment/phonepe/callback`);

  console.log('--- Effective PhonePe Config ---');
  console.log('Merchant ID:', merchantId);
  console.log('Salt Index:', saltIndex);
  console.log('Base URL:', baseUrl);
  console.log('Config Source: Database (Admin Panel)');
  console.log('---');

  // PhonePe limit is 38 chars. T(1) + ms_short(10) + X(1) + ID(24) = 36 chars. Perfect.
  const merchantTransactionId = `T${Date.now().toString().slice(-10)}X${order._id}`;
  
  const payload = {
    merchantId,
    merchantTransactionId,
    merchantUserId: order.user.toString(),
    amount: Math.round(order.totalPrice * 100), // in paisa
    redirectUrl: `${backendUrl}/api/payment/phonepe/redirect?orderId=${order._id}`,
    redirectMode: 'REDIRECT', 
    callbackUrl,
    paymentInstrument: {
      type: 'PAY_PAGE'
    },
    mobileNumber: order.shippingAddress?.phone?.replace(/\D/g, '').slice(-10) || '9999999999'
  };

  // Save the unique transaction ID and reset statuses
  order.isPaid = false; // Force false on re-attempt in case of state weirdness
  order.paidAt = undefined;
  order.paymentResult = { 
    id: undefined,
    merchantTransactionId,
    status: 'PAYMENT_PENDING',
    message: '',
    update_time: Date.now()
  };
  await order.save();

  console.log(`>>> INITIATED PAYMENT FOR ORDER: ${order._id}`);
  console.log(`>>> TRANSACTION ID: ${merchantTransactionId}`);
  const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
  
  // CRITICAL: PhonePe checksum MUST match the actual URI path used in the request.
  // We extract the path from the base URL + our endpoint path.
  const fullPath = joinUrl(baseUrl, '/pg/v1/pay');
  const pathObj = new URL(fullPath);
  const endpoint = pathObj.pathname;
  
  console.log(`Hashing with path: ${endpoint}`);
  
  const stringToSign = base64Payload + endpoint + saltKey;
  const sha256Hash = crypto.createHash('sha256').update(stringToSign).digest('hex');
  const xVerify = sha256Hash + "###" + saltIndex;

  try {
    const targetUrl = joinUrl(baseUrl, '/pg/v1/pay');
    console.log('Sending request to PhonePe:', targetUrl);
    console.log('Calculating checksum with endpoint:', endpoint);
    const response = await axios.post(
      targetUrl,
      { request: base64Payload },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': xVerify,
          'X-MERCHANT-ID': merchantId,
          accept: 'application/json',
        },
      }
    );

    console.log('Sending X-VERIFY:', xVerify);
    console.log('PhonePe Response Status:', response.status);
    console.log('PhonePe Response:', JSON.stringify(response.data, null, 2));

    if (response.data.success) {
      res.status(200).json({
        success: true,
        url: response.data.data.instrumentResponse.redirectInfo.url,
      });
    } else {
      console.error('PhonePe business failure:', response.data.message || response.data.code);
      res.status(400).json({ 
        success: false, 
        message: response.data.message || 'PhonePe rejected the transaction',
        code: response.data.code 
      });
    }
  } catch (error) {
    console.error('--- PhonePe API TRACE ---');
    if (error.response) {
      console.error('PhonePe Server Response Error:', error.response.status);
      console.error('Payload Sent To PhonePe:', JSON.stringify(payload, null, 2));
      console.error('Error Details:', JSON.stringify(error.response.data, null, 2));
      
      return res.status(error.response.status || 500).json({ 
        success: false, 
        message: error.response.data.message || 'PhonePe Gateway Error',
        code: error.response.data.code,
        details: error.response.data
      });
    } else {
      console.error('Network/Internal Error:', error.message);
    }
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Error communicating with PhonePe Gateway' 
    });
  }
});

const { getPhonePeErrorMessage } = require('../utils/phonePeErrors');

// @desc    Check PhonePe Payment Status
// @route   GET /api/payment/phonepe/status/:orderId
// @access  Private
const checkPhonePeStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const order = await Order.findById(orderId);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  const merchantId = await getConfig('phonepe_merchant_id', process.env.PHONEPE_MERCHANT_ID);
  const saltKey = await getConfig('phonepe_salt_key', process.env.PHONEPE_SALT_KEY);
  const saltIndex = await getConfig('phonepe_salt_index', process.env.PHONEPE_SALT_INDEX || '1');
  const baseUrl = await getConfig('phonepe_base_url', process.env.PHONEPE_BASE_URL);

  // We need the original transaction ID. Since we use Date.now() + X + orderId
  // We should ideally store the transactionId in the order for exact status checking.
  // For now, we'll search orders or rely on the most recent one if not stored.
  // IMPROVEMENT: Search paymentResult if it exists
  const merchantTransactionId = order.paymentResult?.merchantTransactionId || order._id.toString();

  // Similarly for status check, the hash must match the actual request path
  const statusPath = `/pg/v1/status/${merchantId}/${merchantTransactionId}`;
  const fullStatusUrl = joinUrl(baseUrl, statusPath);
  const statusPathObj = new URL(fullStatusUrl);
  const endpoint = statusPathObj.pathname;

  console.log(`Hashing status with path: ${endpoint}`);

  const stringToSign = endpoint + saltKey;
  const sha256Hash = crypto.createHash('sha256').update(stringToSign).digest('hex');
  const xVerify = sha256Hash + "###" + saltIndex;

  try {
    console.log(`--- CHECKING STATUS FOR ORDER: ${orderId} ---`);
    console.log(`Transaction ID: ${merchantTransactionId}`);
    
    const statusUrl = joinUrl(baseUrl, `/pg/v1/status/${merchantId}/${merchantTransactionId}`);
    
    const response = await axios.get(
      statusUrl,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': xVerify,
          'X-MERCHANT-ID': merchantId,
          accept: 'application/json',
        },
      }
    );

    const data = response.data;
    console.log('PhonePe Status Response:', JSON.stringify(data, null, 2));

    // Precise success check: Look for SUCCESS or PAYMENT_SUCCESS in either the top-level code or data object
    const isVerifiedSuccess = (data.success && (data.code === 'PAYMENT_SUCCESS' || data.code === 'SUCCESS')) || 
                               (data.data?.status === 'COMPLETED' || data.data?.status === 'SUCCESS');
    
    if (isVerifiedSuccess) {
      if (!order.isPaid) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
          id: data.data.transactionId,
          status: data.code,
          update_time: Date.now(),
          message: 'Verified via manual check',
          rawResponse: data
        };
        await order.save();
        console.log(`Order ${orderId} marked as PAID via status check`);
      }
      return res.json({ success: true, status: 'SUCCESS', message: 'Payment verified successfully' });
    } else if (data.code === 'PAYMENT_PENDING') {
      // Log pending state too
      if (order) {
        order.paymentResult = {
          ...order.paymentResult,
          status: data.code,
          rawResponse: data
        };
        await order.save();
      }
      return res.json({ success: false, status: 'PENDING', message: 'Payment is still pending' });
    } else {
      // It failed or is in some other state (like EXPIRED or DECLINED)
      const errorMsg = getPhonePeErrorMessage(data.code || data.data?.status);
      console.log(`Status check result for ${orderId}: ${data.code} - ${errorMsg}`);
      
      // ABSOLUTE PROTECTION: If the bank says anything OTHER than SUCCESS or PENDING,
      // and we had it as PAID, we must REVERT it immediately.
      if (order && order.isPaid) {
         console.warn(`CRITICAL: Reverting payment status for order ${orderId} because gateway check returned: ${data.code || 'FAILURE'}`);
         order.isPaid = false;
         order.paidAt = undefined; // Clear the paid timestamp
      }

      if (order) {
        order.paymentResult = {
          ...order.paymentResult,
          status: data.code || 'FAILED',
          message: errorMsg,
          rawResponse: data
        };
        await order.save();
      }
      
      return res.json({ success: false, status: 'FAILED', message: errorMsg, code: data.code });
    }
  } catch (error) {
    const errorData = error.response?.data || {};
    console.error('PhonePe Status Check API Error:', JSON.stringify(errorData, null, 2));
    
    // Check if it's a 404/Not Found which means the transaction never reached PhonePe
    if (error.response?.status === 404 || errorData.code === 'TRANSACTION_NOT_FOUND') {
      return res.json({ success: false, status: 'NOT_FOUND', message: 'No transaction found for this order ID yet.' });
    }
    
    res.status(500).json({ success: false, message: 'Error communicating with PhonePe gateway' });
  }
});

// @desc    Handle PhonePe Redirect (Verify and send to frontend)
// @route   POST /api/payment/phonepe/redirect
// @access  Public
const handlePhonePeRedirect = asyncHandler(async (req, res) => {
  console.log('--- PHONEPE REDIRECT RECEIVED ---');
  console.log('Method:', req.method);
  console.log('Query:', req.query);
  console.log('Body:', req.body);
  
  const response = req.body?.response || req.query?.response;
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  
  // If the simulator sends status directly instead of the base64 response
  const directStatus = req.query?.status || req.body?.status;
  
  if (!response && !directStatus) {
    console.error('No response or status received from PhonePe');
    return res.redirect(`${frontendUrl}/profile`);
  }
  
  try {
    let code, success, orderId;
    let decodedResponse = null;

    if (response) {
      try {
        decodedResponse = JSON.parse(Buffer.from(response, 'base64').toString('utf-8'));
        console.log('Decoded Redirect Response:', JSON.stringify(decodedResponse, null, 2));
        
        const txnId = decodedResponse.data?.merchantTransactionId || "";
        orderId = txnId.split('X')[1] || req.query?.orderId;
        code = decodedResponse.code;
        success = decodedResponse.success;
      } catch (e) {
        console.error('Failed to decode PhonePe response:', e.message);
      }
    }

    if (!orderId) {
      // Emergency recovery: Try to find ID from any available field
      code = directStatus || req.query?.code || (decodedResponse?.code);
      const possibleTxnId = req.query?.merchantTransactionId || req.query?.transactionId || req.body?.merchantTransactionId || decodedResponse?.data?.merchantTransactionId;
      
      if (possibleTxnId && possibleTxnId.includes('X')) {
        orderId = possibleTxnId.split('X')[1];
      }
      
      // Still no ID? Last resort query param we injected
      if (!orderId) orderId = req.query?.orderId;
      
      success = success || (code === 'SUCCESS' || code === 'PAYMENT_SUCCESS');
    }

    console.log(`Processing redirect for Order: ${orderId}, Success: ${success}, Code: ${code}`);

    if (orderId && (success || code === 'PAYMENT_SUCCESS' || code === 'SUCCESS')) {
      // Update order status in DB immediately on successful redirect for better UX
      if (orderId) {
        const order = await Order.findById(orderId);
        if (order && !order.isPaid) {
          order.isPaid = true;
          order.paidAt = Date.now();
          order.paymentResult = {
            id: req.query?.transactionId || req.body?.transactionId || 'REDC-' + Date.now(),
            status: code,
            update_time: Date.now(),
            message: 'Payment verified via redirect',
            rawResponse: response ? JSON.parse(Buffer.from(response, 'base64').toString('utf-8')) : req.query
          };
          await order.save();
          console.log(`Order ${orderId} marked as PAID via redirect flow`);
        }
      }
      res.redirect(`${frontendUrl}/order/${orderId}/success`);
    } else {
      const errorMsg = getPhonePeErrorMessage(code);
      console.log(`Payment failed for order ${orderId}: ${code} - ${errorMsg}`);
      
      if (orderId) {
        // Also update paymentResult in DB for failures so we can show why it failed
        const order = await Order.findById(orderId);
        if (order) {
           order.paymentResult = {
              ...order.paymentResult,
              status: code,
              message: errorMsg,
              update_time: Date.now(),
              rawResponse: response ? JSON.parse(Buffer.from(response, 'base64').toString('utf-8')) : req.query
           };
           await order.save();
        }
        res.redirect(`${frontendUrl}/order/${orderId}/failed?message=${encodeURIComponent(errorMsg)}&code=${code}`);
      } else {
        res.redirect(`${frontendUrl}/profile?error=${encodeURIComponent(errorMsg)}`);
      }
    }
  } catch (error) {
    console.error('Redirect Processing Error:', error);
    res.redirect(`${frontendUrl}/profile`);
  }
});

// @desc    Handle PhonePe Callback (Server-to-Server)
// @route   POST /api/payment/phonepe/callback
// @access  Public
const phonePeCallback = asyncHandler(async (req, res) => {
  console.log('--- PHONEPE CALLBACK RECEIVED ---');
  const xVerify = req.headers['x-verify'];
  const { response } = req.body;

  if (!xVerify || !response) {
    return res.status(400).send('Invalid response');
  }

  const saltKey = await getConfig('phonepe_salt_key', process.env.PHONEPE_SALT_KEY);
  const saltIndex = await getConfig('phonepe_salt_index', process.env.PHONEPE_SALT_INDEX || '1');

  // Verify HMAC signature
  const stringToSign = response + saltKey;
  const sha256Hash = crypto.createHash('sha256').update(stringToSign).digest('hex');
  const expectedXVerify = sha256Hash + "###" + saltIndex;

  if (xVerify !== expectedXVerify) {
    console.error('PhonePe Callback Signature Mismatch!');
    return res.status(401).send('Security violation');
  }

  try {
    const decodedResponse = JSON.parse(Buffer.from(response, 'base64').toString('utf-8'));
    console.log('Callback Response:', JSON.stringify(decodedResponse, null, 2));

    if (decodedResponse.success && decodedResponse.code === 'PAYMENT_SUCCESS') {
      const txnId = decodedResponse.data.merchantTransactionId;
      const orderId = txnId.split('X')[1];
      const order = await Order.findById(orderId);

      if (order && !order.isPaid) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
          id: decodedResponse.data.transactionId,
          status: decodedResponse.code,
          update_time: Date.now(),
        };
        await order.save();
        console.log(`Order ${orderId} marked as PAID via callback`);
      }
    }
    res.status(200).send('OK');
  } catch (error) {
    console.error('Callback processing error:', error);
    res.status(500).send('Internal Error');
  }
});

module.exports = { initiatePhonePePayment, handlePhonePeRedirect, phonePeCallback, checkPhonePeStatus };
