const router = require("express").Router();
const Joi = require("joi");

const { authMiddleware } = require("../middleware/auth.middleware");
const { consentGateMiddleware } = require("../middleware/consentGate.middleware");
const { validateBody } = require("../middleware/validate.middleware");

const attemptController = require("../controller/attempt.controller");
const { entitlementMiddleware } = require("../middleware/entitlement.middleware");

// Start attempt: needs auth + consent + eligibility + entitlement (for paid tests)
router.post(
  "/tests/:testId/start",
  authMiddleware,
  consentGateMiddleware,
  attemptController.loadTest,
  entitlementMiddleware,
  attemptController.start
);

// Autosave
router.post(
  "/:attemptId/save",
  authMiddleware,
  consentGateMiddleware,
  validateBody(Joi.object({ answers: Joi.object().required() })),
  attemptController.save
);

// Submit
router.post(
  "/:attemptId/submit",
  authMiddleware,
  consentGateMiddleware,
  attemptController.submit
);

module.exports = router;
