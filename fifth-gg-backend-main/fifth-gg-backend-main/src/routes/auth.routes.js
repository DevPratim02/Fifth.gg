const express = require("express");
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

// this will accept a Firebase ID token and ensure a user row exists
router.post("/login", authMiddleware, authController.loginOrRegister);

router.post("/forgot-password", authController.forgotPassword);

module.exports = router;
