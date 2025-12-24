const { asyncHandler } = require("../utils/Asynchandler");

const entitlementMiddleware = asyncHandler(async (req, res, next) => {
  // Placeholder - check if user has access to paid tests
  next();
});

module.exports = { entitlementMiddleware };