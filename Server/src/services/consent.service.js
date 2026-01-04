const { ConsentVersion } = require("../model/ConsentVersion");

async function getLatestConsentVersion() {
  return ConsentVersion.findOne({ isActive: true }).sort({ effectiveAt: -1 });
}

module.exports = { getLatestConsentVersion };
