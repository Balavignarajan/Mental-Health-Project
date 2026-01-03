const router = require("express").Router();
const Joi = require("joi");
const { authMiddleware, requireRole } = require("../middleware/auth.middleware");
const { validateBody } = require("../middleware/validate.middleware");
const assessmentLinkController = require("../controller/assessmentLink.controller");

// Get results for a specific assessment link (admin only) - Must be before /:linkId route
router.get(
  "/:linkId/results",
  authMiddleware,
  requireRole("admin"),
  assessmentLinkController.getLinkResults
);

// Get email history for a specific assessment link (admin only) - Must be before /:linkId route
router.get(
  "/:linkId/email-history",
  authMiddleware,
  requireRole("admin"),
  assessmentLinkController.getEmailHistory
);

// Send assessment link via email (admin only) - Must be before /:linkId route
router.post(
  "/:linkId/send-email",
  authMiddleware,
  requireRole("admin"),
  validateBody(Joi.object({
    recipientEmails: Joi.alternatives().try(
      Joi.string().email(),
      Joi.array().items(Joi.string().email()).min(1)
    ).required(),
    customMessage: Joi.string().allow("").optional()
  })),
  assessmentLinkController.sendEmail
);

// Get all email history (admin only) - Must be before / route
router.get(
  "/email-history/all",
  authMiddleware,
  requireRole("admin"),
  assessmentLinkController.getAllEmailHistory
);

// Get all assessment links (admin only)
router.get(
  "/",
  authMiddleware,
  requireRole("admin"),
  assessmentLinkController.list
);

// Create new assessment link (admin only)
router.post(
  "/",
  authMiddleware,
  requireRole("admin"),
  validateBody(Joi.object({
    testId: Joi.string().required(),
    campaignName: Joi.string().allow("").optional(),
    expiresAt: Joi.date().allow(null).optional(),
    maxAttempts: Joi.number().integer().min(1).allow(null).optional(),
    linkType: Joi.string().valid('free', 'paid').optional(),
    price: Joi.number().min(0).optional()
  })),
  assessmentLinkController.create
);

module.exports = router;

