const router = require("express").Router();
const testController = require("../controller/test.controller");

router.get("/", testController.list);
router.get("/:testId", testController.getById);

module.exports = router;
