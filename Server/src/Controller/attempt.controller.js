const { asyncHandler } = require("../utils/Asynchandler");
const { ok } = require("../utils/Response");

exports.loadTest = asyncHandler(async (req, res, next) => {
  // Placeholder
  next();
});

exports.start = asyncHandler(async (req, res) => {
  res.json({ success: true, message: "Attempt start placeholder" });
});

exports.save = asyncHandler(async (req, res) => {
  res.json({ success: true, message: "Attempt save placeholder" });
});

exports.submit = asyncHandler(async (req, res) => {
  res.json({ success: true, message: "Attempt submit placeholder" });
});