const router = require("express").Router();
const Joi = require("joi");
const { authMiddleware, requireRole } = require("../middleware/auth.middleware");
const { validateBody } = require("../middleware/validate.middleware");
const assessmentLinkController = require("../controller/assessmentLink.controller");

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
    maxAttempts: Joi.number().integer().min(1).allow(null).optional()
  })),
  assessmentLinkController.create
);

module.exports = router;

