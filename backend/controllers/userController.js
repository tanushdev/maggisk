const crypto = require('crypto');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log(`Login attempt for: ${email}`);

  // Check database for user
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    console.log('Login successful');
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin || user.email === process.env.ADMIN_EMAIL,
      token: generateToken(user._id),
    });
  } else {
    console.log('Login failed: Invalid credentials');
    res.status(401);
    throw new Error('Invalid email or password');
  }
});


// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    // Send Welcome Email
    try {
      const sendEmail = require('../utils/sendEmail');
      await sendEmail({
        email: user.email,
        subject: '✨ Welcome to the Sanctum of Maggik Stones',
        html: `
          <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #fcfaf7; padding: 40px 0;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border: 1px solid #eeeeee; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
              <tr>
                <td align="center" style="padding: 40px 0; background-color: #1a1a1a;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 4px; text-transform: uppercase;">Maggik Stones</h1>
                  <p style="color: #bda689; margin: 10px 0 0; font-size: 10px; letter-spacing: 3px;">SACRED NATURAL CRYSTALS</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 50px 40px; text-align: center;">
                  <h2 style="color: #1a1a1a; font-size: 20px; margin-bottom: 20px; font-style: italic;">Welcome Home, ${user.name}</h2>
                  <p style="color: #666666; font-size: 15px; line-height: 1.8; margin-bottom: 30px;">
                    Your journey into the world of natural energy and sacred stones begins today. We are honored to have you join our circle of seekers.
                  </p>
                  <div style="margin: 30px 0;">
                    <a href="${process.env.FRONTEND_URL}" style="background-color: #bda689; color: #ffffff; padding: 18px 35px; text-decoration: none; border-radius: 2px; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; display: inline-block;">Explore the Collection</a>
                  </div>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding: 30px; background-color: #fafafa; border-top: 1px solid #eeeeee;">
                  <p style="margin: 0; font-size: 10px; color: #999999; text-transform: uppercase; letter-spacing: 1px;">&copy; 2024 Maggik Stones - Guided by Nature</p>
                </td>
              </tr>
            </table>
          </div>
        `
      });
    } catch (emailErr) {
      console.error('Welcome email failed:', emailErr);
    }

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin || user.email === process.env.ADMIN_EMAIL,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin || user.email === process.env.ADMIN_EMAIL,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Forgot Password
// @route   POST /api/users/forgotpassword
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    res.status(404);
    throw new Error('User not found with that email');
  }

  // Generate Reset Token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  user.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire (10 minutes)
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  await user.save({ validateBeforeSave: false });

  // Create reset url
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  try {
    console.log(`Attempting to send reset email to: ${user.email}`);
    const sendEmail = require('../utils/sendEmail');
    await sendEmail({
      email: user.email,
      subject: '🔑 Password Reset Request - Maggik Stones',
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #fcfaf7; padding: 40px 0;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border: 1px solid #eeeeee; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
            <tr>
              <td align="center" style="padding: 40px 0; background-color: #1a1a1a;">
                <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 4px; text-transform: uppercase;">Maggik Stones</h1>
                <p style="color: #bda689; margin: 10px 0 0; font-size: 10px; letter-spacing: 3px;">SACRED RECOVERY</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 50px 40px; text-align: center;">
                <h2 style="color: #1a1a1a; font-size: 18px; margin-bottom: 20px;">Lost your secret key?</h2>
                <p style="color: #666666; font-size: 14px; line-height: 1.8; margin-bottom: 30px;">
                  No worries. Life is a journey of rediscovery. Click the button below to reset your password and regain access to your sanctum.
                </p>
                <div style="margin: 30px 0;">
                  <a href="${resetUrl}" style="background-color: #1a1a1a; color: #ffffff; padding: 18px 35px; text-decoration: none; border-radius: 2px; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; display: inline-block;">Reset Password</a>
                </div>
                <p style="color: #999999; font-size: 11px;">This link will expire in 10 minutes for your security.</p>
              </td>
            </tr>
          </table>
        </div>
      `,
    });
    console.log('Reset email sent successfully');
    res.status(200).json({ message: 'Reset email sent successfully' });
  } catch (err) {
    console.error('FAILED TO SEND RESET EMAIL:', err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(500);
    throw new Error(`Email could not be sent: ${err.message}`);
  }
});

// @desc    Reset Password
// @route   PUT /api/users/resetpassword/:resettoken
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired token');
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin || user.email === process.env.ADMIN_EMAIL,
    token: generateToken(user._id),
  });
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.isAdmin && user.email === process.env.ADMIN_EMAIL) {
      res.status(400);
      throw new Error('Cannot delete super admin');
    }
    await user.deleteOne();
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.isAdmin !== undefined ? req.body.isAdmin : user.isAdmin;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin || updatedUser.email === process.env.ADMIN_EMAIL,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

module.exports = {
  authUser,
  registerUser,
  getUserProfile,
  getUsers,
  forgotPassword,
  resetPassword,
  deleteUser,
  getUserById,
  updateUser
};

