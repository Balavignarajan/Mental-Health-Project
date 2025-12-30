const crypto = require("crypto");
const { asyncHandler } = require("../utils/Asynchandler");
const { ok, created } = require("../utils/Response");
const { AssessmentLink } = require("../model/AssessmentLink");
const { Test } = require("../model/Test");
const { EmailHistory } = require("../model/EmailHistory");
const { writeAudit } = require("../services/audit.service");
const { sendAssessmentLinkEmail } = require("../services/mail.service");

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

/**
 * Send assessment link via email (admin only)
 * Supports bulk sending to multiple recipients
 */
exports.sendEmail = asyncHandler(async (req, res) => {
  const { linkId } = req.params;
  const { recipientEmails, customMessage } = req.body;

  // Validate required fields
  if (!recipientEmails) {
    return res.status(400).json({ success: false, message: "recipientEmails is required" });
  }

  // Convert to array if single email provided
  const emails = Array.isArray(recipientEmails) ? recipientEmails : [recipientEmails];
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const invalidEmails = emails.filter(email => !emailRegex.test(email.trim()));
  if (invalidEmails.length > 0) {
    return res.status(400).json({ 
      success: false, 
      message: `Invalid email addresses: ${invalidEmails.join(', ')}` 
    });
  }

  // Find assessment link
  const linkDoc = await AssessmentLink.findById(linkId)
    .populate("testId", "title shortDescription");
  
  if (!linkDoc) {
    return res.status(404).json({ success: false, message: "Assessment link not found" });
  }

  // Build full link URL
  const { cfg } = require("../config/config");
  const baseUrl = cfg.APP_BASE_URL || cfg.CORS_ORIGIN || 'http://localhost:5000';
  const fullLinkUrl = `${baseUrl}/assessment-link/${linkDoc.linkToken}`;

  // Send emails (mail service handles bulk sending internally)
  try {
    const emailResults = await sendAssessmentLinkEmail(
      emails, // Array of emails - service handles bulk sending
      fullLinkUrl,
      linkDoc.campaignName || '',
      linkDoc.testId?.title || 'Assessment',
      linkDoc.testId?.shortDescription || '',
      linkDoc.expiresAt,
      customMessage || ''
    );

    // Save email history for each email sent
    const subject = linkDoc.campaignName 
      ? `${linkDoc.campaignName} - Take Your Assessment`
      : `Take the ${linkDoc.testId?.title || 'Assessment'} Assessment`;

    const emailHistoryPromises = emailResults.map(result => {
      return EmailHistory.create({
        assessmentLinkId: linkDoc._id,
        sentBy: req.user._id,
        recipientEmail: result.email,
        subject: subject,
        status: result.success ? "sent" : "failed",
        errorMessage: result.success ? null : (result.error || "Unknown error"),
        customMessage: customMessage || "",
        metadata: {
          linkToken: linkDoc.linkToken,
          testId: String(linkDoc.testId?._id || ''),
          testTitle: linkDoc.testId?.title || 'Assessment'
        }
      });
    });

    // Wait for all history records to be saved (don't fail if history save fails)
    try {
      await Promise.all(emailHistoryPromises);
    } catch (historyError) {
      console.error('Failed to save email history (non-critical):', historyError);
      // Continue even if history save fails
    }

    // Count successes and failures
    const successful = emailResults.filter(r => r.success).length;
    const failed = emailResults.filter(r => !r.success).length;

    await writeAudit({ 
      userId: req.user._id, 
      action: "ADMIN_SEND_LINK_EMAIL", 
      resourceType: "assessmentLink", 
      resourceId: String(linkDoc._id), 
      req,
      meta: { recipientCount: emails.length, successful, failed }
    });

    return ok(res, "Emails sent", {
      total: emails.length,
      successful,
      failed,
      results: emailResults
    });
  } catch (error) {
    console.error('Error sending assessment link emails:', error);
    return res.status(500).json({ 
      success: false, 
      message: `Failed to send emails: ${error.message}` 
    });
  }
});

/**
 * Get email history for a specific assessment link (admin only)
 */
exports.getEmailHistory = asyncHandler(async (req, res) => {
  const { linkId } = req.params;
  const { page = 1, limit = 20, status } = req.query;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  // Verify link exists
  const linkDoc = await AssessmentLink.findById(linkId);
  if (!linkDoc) {
    return res.status(404).json({ success: false, message: "Assessment link not found" });
  }

  // Build filter
  const filter = { assessmentLinkId: linkId };
  if (status && (status === "sent" || status === "failed")) {
    filter.status = status;
  }

  // Fetch email history with pagination
  const [history, total] = await Promise.all([
    EmailHistory.find(filter)
      .populate("sentBy", "firstName lastName email")
      .sort({ sentAt: -1 })
      .skip(skip)
      .limit(limitNum),
    EmailHistory.countDocuments(filter)
  ]);

  return ok(res, "Email history retrieved", {
    history,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum)
    }
  });
});

/**
 * Get all email history (admin only) - across all links
 */
exports.getAllEmailHistory = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status, linkId } = req.query;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  // Build filter
  const filter = {};
  if (status && (status === "sent" || status === "failed")) {
    filter.status = status;
  }
  if (linkId) {
    filter.assessmentLinkId = linkId;
  }

  // Fetch email history with pagination
  const [history, total] = await Promise.all([
    EmailHistory.find(filter)
      .populate("assessmentLinkId", "campaignName linkToken")
      .populate("sentBy", "firstName lastName email")
      .sort({ sentAt: -1 })
      .skip(skip)
      .limit(limitNum),
    EmailHistory.countDocuments(filter)
  ]);

  return ok(res, "Email history retrieved", {
    history,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum)
    }
  });
});

