const { asyncHandler } = require("../utils/Asynchandler");
const { ok } = require("../utils/Response");

exports.list = asyncHandler(async (req, res) => {
  res.json({ success: true, message: "Results list placeholder" });
});

exports.trends = asyncHandler(async (req, res) => {
  res.json({ success: true, message: "Results trends placeholder" });
});

exports.getById = asyncHandler(async (req, res) => {
  res.json({ success: true, message: "Result by ID placeholder" });
});