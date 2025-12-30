const router = require("express").Router();
const Joi = require("joi");
const { validateBody } = require("../middleware/validate.middleware");
const publicAssessmentLinkController = require("../controller/publicAssessmentLink.controller");

// Validate assessment link token (public, no auth required)
router.get(
  "/:token/validate",
  publicAssessmentLinkController.validate
);

// Start anonymous assessment attempt (public, no auth required)
router.post(
  "/:token/start",
  validateBody(Joi.object({
    participantInfo: Joi.object({
      name: Joi.string().optional(),
      email: Joi.string().email().optional(),
      dateOfBirth: Joi.string().optional(),
      gender: Joi.string().optional()
    }).optional()
  })),
  publicAssessmentLinkController.start
);

// Save answers for anonymous attempt (public, no auth required)
router.post(
  "/:token/save/:attemptId",
  validateBody(Joi.object({
    answers: Joi.object().required()
  })),
  publicAssessmentLinkController.save
);

// Submit anonymous attempt (public, no auth required)
router.post(
  "/:token/submit/:attemptId",
  validateBody(Joi.object({
    answers: Joi.object().optional()
  })),
  publicAssessmentLinkController.submit
);

module.exports = router;

