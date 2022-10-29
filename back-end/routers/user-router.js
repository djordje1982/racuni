const express = require("express");
const router = express.Router();
const controller = require("../controllers/user-controller");
const security = require("../middleware/security");

router.post("/signup/", controller.postSignUp);
router.post("/login/", controller.postLogIn);
router.get("/:userId", security, controller.getUser);

module.exports = router;
