const phonePeErrorCodes = {
  'TXN_AUTO_FAILED': 'Payment couldn’t be completed due to customer or bank issues.',
  'Z9': 'Insufficient balance in customer’s account.',
  'INSUFFICIENT_BALANCE': 'Insufficient balance in customer’s account.',
  'ZM': 'Invalid UPI PIN entered.',
  'U90': 'Bank is taking longer than usual to process this payment.',
  'BANK_TECHNICAL_ISSUE': 'Technical issue at the customer’s bank.',
  'Z7': 'Customer exceeded their daily payment limit.',
  'Z6': 'Wrong PIN entered too many times.',
  'B3': 'Account type not supported for this payment.',
  'Z8': 'Customer exceeded their daily payment limit.',
  'K1': 'Payment declined by bank for security reasons.',
  'YE': 'Customer’s bank account is blocked or frozen.',
  'XH': 'Customer’s bank account is invalid or unregistered.',
  'NO': 'Original payment request not found.',
  'ZA': 'Payment cancelled by customer.',
  'ZH': 'Invalid UPI ID entered.',
  'ORDER_EXPIRED': 'Payment request has expired.',
  'ORDER_CANCELLED_BY_USER': 'Payment cancelled by user.',
  'SUCCESS': 'Payment successful.',
  'PENDING': 'Payment is being processed. Please check after 15 minutes.',
  'TXN_STATUS_AWAITED': 'Payment is being processed. Please check after 15 minutes.',
  'INTERNAL_SECURITY_BLOCK': 'Payment blocked due to security reasons.',
  'INTERNAL_SECURITY_BLOCK_1': 'Payment blocked (URL mismatch).',
  'INTERNAL_SECURITY_BLOCK_2': 'Payment blocked (IP mismatch).',
  'INTERNAL_SECURITY_BLOCK_5': 'Payment blocked (Policies missing on website).',
  'INTERNAL_SECURITY_BLOCK_6': 'Payment blocked (Video KYC pending).',
  'FAILED.EXPIRY': 'Payment request has expired. Please try again.',
  'PAYMENT_ERROR': 'Final payment status could not be determined.',
  'INTERNAL_SERVER_ERROR': 'The simulator encountered an internal error.',
  'BAD_REQUEST': 'Invalid request parameters sent to PhonePe.',
  'AUTHORIZATION_FAILED': 'Payment was not authorized by the bank.',
  'EXPIRY': 'The payment link has expired.',
};

const getPhonePeErrorMessage = (code) => {
  return phonePeErrorCodes[code] || 'Payment failed due to technical issues. Please try again.';
};

module.exports = { phonePeErrorCodes, getPhonePeErrorMessage };
