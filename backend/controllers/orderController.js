const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Coupon = require('../models/Coupon');
const sendEmail = require('../utils/sendEmail');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  console.log('Incoming order data:', req.body);
  console.log('User from request:', req.user);

  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      couponCode,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      res.status(400);
      throw new Error('No items in order');
    } else {
      // Check stock first
      for (const item of orderItems) {
        console.log(`Checking stock for: ${item.name} (${item.product})`);
        const product = await Product.findById(item.product);
        if (!product) {
          res.status(404);
          throw new Error(`Product ${item.name} not found`);
        }
        if (product.countInStock < item.qty) {
          res.status(400);
          throw new Error(`Insufficient stock for ${item.name}. Available: ${product.countInStock}`);
        }
      }

      console.log('Calculated items, proceeding to save order');

      const order = new Order({
        orderItems,
        user: req.user._id,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      });

      const createdOrder = await order.save();
      console.log('Order saved successfully:', createdOrder._id);

      // Update stock
      for (const item of createdOrder.orderItems) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { countInStock: -item.qty }
        });
      }

      // Handle Coupon usage
      if (couponCode) {
        console.log('Applying coupon usage count:', couponCode);
        await Coupon.findOneAndUpdate(
          { code: couponCode.toUpperCase().trim() },
          { $inc: { usedCount: 1 } }
        );
      }

      // Notify Admin via Email
      try {
        const orderList = createdOrder.orderItems.map(item => 
          `<li>${item.name} x ${item.qty} - ₹${item.price * item.qty}</li>`
        ).join('');

        await sendEmail({
          email: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
          subject: `✨ New Order Received! #${createdOrder._id.toString().slice(-6).toUpperCase()}`,
          html: `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f9f9f9; padding: 40px 0;">
              <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border: 1px solid #eeeeee; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                <!-- Header -->
                <tr>
                  <td align="center" style="padding: 40px 0; background-color: #1a1a1a;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 4px; text-transform: uppercase;">Maggik Stones</h1>
                    <p style="color: #bda689; margin: 10px 0 0; font-size: 12px; letter-spacing: 2px;">NEW ORDER MANIFESTED</p>
                  </td>
                </tr>
                
                <!-- Body -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <p style="font-size: 16px; color: #333333; margin-bottom: 25px;">Greetings Admin,</p>
                    <p style="font-size: 14px; color: #666666; line-height: 1.6;">A new seeker, <strong>${req.user.name}</strong>, has just placed an order. The natural energy is moving!</p>
                    
                    <div style="margin: 30px 0; padding: 25px; background-color: #fafafa; border-radius: 4px;">
                      <h3 style="margin-top: 0; font-size: 14px; text-transform: uppercase; color: #1a1a1a; border-bottom: 2px solid #bda689; padding-bottom: 10px; display: inline-block;">Order Summary</h3>
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 15px;">
                        ${createdOrder.orderItems.map(item => `
                          <tr>
                            <td style="padding: 10px 0; font-size: 14px; color: #333333; border-bottom: 1px solid #eeeeee;">${item.name} <span style="color: #999999;">x${item.qty}</span></td>
                            <td align="right" style="padding: 10px 0; font-size: 14px; color: #1a1a1a; font-weight: bold; border-bottom: 1px solid #eeeeee;">₹${(item.price * item.qty).toFixed(0)}</td>
                          </tr>
                        `).join('')}
                        <tr>
                          <td style="padding: 15px 0 5px; font-size: 13px; color: #666666;">Shipping Fee</td>
                          <td align="right" style="padding: 15px 0 5px; font-size: 13px; color: #666666;">₹${createdOrder.shippingPrice.toFixed(0)}</td>
                        </tr>
                        <tr>
                          <td style="padding: 5px 0 20px; font-size: 14px; font-weight: bold; color: #1a1a1a; text-transform: uppercase;">Total Manifestation</td>
                          <td align="right" style="padding: 5px 0 20px; font-size: 18px; font-weight: bold; color: #bda689;">₹${createdOrder.totalPrice.toFixed(0)}</td>
                        </tr>
                      </table>
                    </div>

                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                      <tr>
                        <td width="50%" valign="top">
                          <h4 style="margin: 0 0 10px; font-size: 12px; text-transform: uppercase; color: #999999;">Shipping Destination</h4>
                          <p style="margin: 0; font-size: 13px; color: #333333; line-height: 1.5;">
                            ${createdOrder.shippingAddress.address}<br />
                            ${createdOrder.shippingAddress.city}, ${createdOrder.shippingAddress.state} ${createdOrder.shippingAddress.postalCode}<br />
                            Phone: ${createdOrder.shippingAddress.phone}
                          </p>
                        </td>
                        <td width="50%" valign="top">
                          <h4 style="margin: 0 0 10px; font-size: 12px; text-transform: uppercase; color: #999999;">Payment Method</h4>
                          <p style="margin: 0; font-size: 13px; color: #333333; line-height: 1.5;">
                            ${createdOrder.paymentMethod}
                          </p>
                        </td>
                      </tr>
                    </table>

                    <div align="center" style="margin-top: 40px;">
                      <a href="${process.env.FRONTEND_URL}/admin/order/${createdOrder._id}" style="background-color: #1a1a1a; color: #ffffff; padding: 18px 30px; text-decoration: none; border-radius: 2px; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; display: inline-block;">Fulfill Order Details</a>
                    </div>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td align="center" style="padding: 30px; background-color: #fafafa; border-top: 1px solid #eeeeee;">
                    <p style="margin: 0; font-size: 11px; color: #999999; text-transform: uppercase; letter-spacing: 1px;">&copy; 2024 Maggik Stones - Sacred Commerce</p>
                  </td>
                </tr>
              </table>
            </div>
          `
        });

        // Notify Customer via Email
        await sendEmail({
          email: req.user.email,
          subject: '✨ Order Confirmed - Maggik Stones',
          html: `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #fcfaf7; padding: 40px 0;">
              <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border: 1px solid #eeeeee; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                <tr>
                  <td align="center" style="padding: 50px 0; background-color: #1a1a1a;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 4px; text-transform: uppercase;">Maggik Stones</h1>
                    <p style="color: #bda689; margin: 10px 0 0; font-size: 10px; letter-spacing: 3px;">YOUR SACRED ENERGY IS ON THE WAY</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 50px 40px;">
                    <h2 style="color: #1a1a1a; font-size: 20px; margin-bottom: 20px; font-style: italic;">Thank you for your order, ${req.user.name.split(' ')[0]}!</h2>
                    <p style="color: #666666; font-size: 15px; line-height: 1.8; margin-bottom: 30px;">
                      We've received your order and are currently preparing your crystals with care. You'll receive another update once your items have been shipped.
                    </p>
                    
                    <div style="background-color: #fafafa; padding: 30px; border-radius: 4px; margin-bottom: 30px;">
                      <p style="margin: 0 0 10px; font-size: 12px; color: #999999; text-transform: uppercase;">Order Number</p>
                      <p style="margin: 0; font-size: 16px; font-weight: bold; color: #1a1a1a;">#${createdOrder._id.toString().slice(-8).toUpperCase()}</p>
                    </div>

                    <h3 style="font-size: 14px; text-transform: uppercase; color: #1a1a1a; border-bottom: 1px solid #eeeeee; padding-bottom: 10px; margin-bottom: 20px;">Order Details</h3>
                    <table width="100%" cellpadding="0" cellspacing="0">
                       ${createdOrder.orderItems.map(item => `
                          <tr>
                            <td style="padding: 10px 0; font-size: 14px; color: #333333;">${item.name} x${item.qty}</td>
                            <td align="right" style="padding: 10px 0; font-size: 14px; font-weight: bold; color: #1a1a1a;">₹${(item.price * item.qty).toFixed(0)}</td>
                          </tr>
                        `).join('')}
                    </table>
                    
                    <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #bda689;">
                      <table width="100%">
                        <tr>
                          <td style="font-size: 16px; font-weight: bold; color: #1a1a1a;">Total Paid</td>
                          <td align="right" style="font-size: 20px; font-weight: bold; color: #bda689;">₹${createdOrder.totalPrice.toFixed(0)}</td>
                        </tr>
                      </table>
                    </div>

                    <div style="margin-top: 40px; padding: 25px; border: 1px dashed #dddddd; text-align: center;">
                       <p style="margin: 0; font-size: 13px; color: #666666;">Expected Delivery: <strong>5-7 Business Days</strong></p>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding: 30px; background-color: #1a1a1a;">
                    <a href="${process.env.FRONTEND_URL}/profile" style="color: #ffffff; text-decoration: none; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">View Order Status</a>
                    <p style="margin: 15px 0 0; font-size: 10px; color: #666666;">&copy; 2024 Maggik Stones - Crafted by Nature</p>
                  </td>
                </tr>
              </table>
            </div>
          `
        });
      } catch (emailErr) {
        console.error('Email sending failed, but order was created:', emailErr);
      }

      res.status(201).json(createdOrder);
    }
  } catch (error) {
    console.error('SERVER ERROR IN addOrderItems:', error);
    if (error.name === 'ValidationError') {
      res.status(400).json({ message: 'Validation Error', errors: error.errors });
    } else {
      res.status(500).json({ message: error.message || 'Server Error' });
    }
    throw error;
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer?.email_address,
    };

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name').sort({ createdAt: -1 });
  res.json(orders);
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    await order.deleteOne();
    res.json({ message: 'Order removed' });
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get dashboard stats
// @route   GET /api/orders/stats
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
  const productsCount = await Product.countDocuments({});
  const usersCount = await User.countDocuments({});
  const orders = await Order.find({});
  
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((acc, order) => acc + (order.isPaid ? order.totalPrice : 0), 0);
  const pendingPayments = orders.filter(o => !o.isPaid).length;

  res.json({
    totalProducts: productsCount,
    totalOrders,
    totalRevenue,
    activeUsers: usersCount,
    pendingPayments
  });
});

module.exports = {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getOrders,
  updateOrderToDelivered,
  deleteOrder,
  getDashboardStats
};
