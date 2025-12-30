const crypto = require("crypto");
const { asyncHandler } = require("../utils/Asynchandler");
const { ok, created } = require("../utils/Response");
const { AssessmentLink } = require("../model/AssessmentLink");
const { Test } = require("../model/Test");
const { writeAudit } = require("../services/audit.service");

/**
 * Create new assessment link (admin only)
 */
exports.create = asyncHandler(async (req, res) => {
  const { testId, campaignName, expiresAt, maxAttempts } = req.body;

  // Validate required fields
  if (!testId) {
    return res.status(400).json({ success: false, message: "testId is required" });
  }

  // Verify test exists and is active
  const testDoc = await Test.findById(testId);
  if (!testDoc) {
    return res.status(404).json({ success: false, message: "Test not found" });
  }

  if (!testDoc.isActive) {
    return res.status(400).json({ success: false, message: "Test is not active" });
  }

  // Generate unique token (32 bytes = 64 hex characters)
  let linkToken;
  let isUnique = false;
  while (!isUnique) {
    linkToken = crypto.randomBytes(32).toString("hex");
    const existing = await AssessmentLink.findOne({ linkToken });
    if (!existing) {
      isUnique = true;
    }
  }

  // Parse expiration date if provided
  let expiresAtDate = null;
  if (expiresAt) {
    expiresAtDate = new Date(expiresAt);
    if (isNaN(expiresAtDate.getTime())) {
      return res.status(400).json({ success: false, message: "Invalid expiresAt date format" });
    }
  }

  // Create assessment link
  const newLink = await AssessmentLink.create({
    linkToken,
    testId,
    createdBy: req.user._id,
    campaignName: campaignName || "",
    expiresAt: expiresAtDate,
    maxAttempts: maxAttempts || null,
    currentAttempts: 0,
    isActive: true
  });

  await writeAudit({ 
    userId: req.user._id, 
    action: "ADMIN_CREATE_ASSESSMENT_LINK", 
    resourceType: "assessmentLink", 
    resourceId: String(newLink._id), 
    req 
  });

  return created(res, "Assessment link created successfully", newLink);
});

/**
 * Get all assessment links (admin only)
 */
exports.list = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, isActive = "" } = req.query;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const filter = {};

  // Filter by isActive status
  if (isActive === "false") {
    filter.isActive = false;
  } else if (isActive === "true") {
    filter.isActive = true;
  } else if (isActive === "all") {
    // Show all links (both active and inactive)
  } else {
    // Default: show only active links
    filter.isActive = true;
  }

  const [links, total] = await Promise.all([
    AssessmentLink.find(filter)
      .populate("testId", "title shortDescription imageUrl")
      .populate("createdBy", "firstName lastName email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    AssessmentLink.countDocuments(filter)
  ]);

  return ok(res, "Assessment links list", {
    links,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum)
    }
  });
});

/**
 * Get results for a specific assessment link (admin only)
 */
exports.getLinkResults = asyncHandler(async (req, res) => {
  const { Result } = require("../model/Result");
  const { linkId } = req.params;
  const { page = 1, limit = 20 } = req.query;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  // Find the assessment link first
  const linkDoc = await AssessmentLink.findById(linkId);
  if (!linkDoc) {
    return res.status(404).json({ success: false, message: "Assessment link not found" });
  }

  // Find all results for this link token
  const filter = { linkToken: linkDoc.linkToken };

  const [results, total] = await Promise.all([
    Result.find(filter)
      .populate("testId", "title category")
      .populate("attemptId", "startedAt submittedAt answers participantInfo")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Result.countDocuments(filter)
  ]);

  return ok(res, "Link results", {
    results,
    link: {
      _id: linkDoc._id,
      linkToken: linkDoc.linkToken,
      campaignName: linkDoc.campaignName,
      currentAttempts: linkDoc.currentAttempts
    },
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum)
    }
  });
});

