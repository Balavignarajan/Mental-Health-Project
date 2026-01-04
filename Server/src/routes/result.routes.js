const router = require("express").Router();
const { authMiddleware } = require("../middleware/auth.middleware");
const { consentGateMiddleware } = require("../middleware/consentGate.middleware");
const resultController = require("../controller/result.controller");

router.get("/", authMiddleware, consentGateMiddleware, resultController.list);
router.get("/trends", authMiddleware, consentGateMiddleware, resultController.trends);
router.get("/:resultId", authMiddleware, consentGateMiddleware, resultController.getById);

module.exports = router;
