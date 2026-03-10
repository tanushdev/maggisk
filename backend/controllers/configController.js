const asyncHandler = require('express-async-handler');
const Config = require('../models/Config');

// @desc    Get all config
// @route   GET /api/config
// @access  Private/Admin
const getConfigs = asyncHandler(async (req, res) => {
  const configs = await Config.find({});
  res.json(configs);
});

// @desc    Update/Create config
// @route   POST /api/config
// @access  Private/Admin
const updateConfig = asyncHandler(async (req, res) => {
  const { key, value } = req.body;
  
  let config = await Config.findOne({ key });
  
  if (config) {
    config.value = value;
    await config.save();
  } else {
    config = await Config.create({ key, value });
  }
  
  res.json(config);
});

module.exports = { getConfigs, updateConfig };
