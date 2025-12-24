const { asyncHandler } = require("../utils/Asynchandler");

const consentGateMiddleware = asyncHandler(async (req, res, next) => {
  // Placeholder - check if user has accepted latest consent
  next();
});

module.exports = { consentGateMiddleware };