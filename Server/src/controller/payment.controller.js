const { asyncHandler } = require("../utils/Asynchandler");
const { ok } = require("../utils/Response");

exports.createOrder = asyncHandler(async (req, res) => {
  res.json({ success: true, message: "Create order placeholder" });
});

exports.webhook = asyncHandler(async (req, res) => {
  res.json({ success: true, message: "Webhook placeholder" });
});