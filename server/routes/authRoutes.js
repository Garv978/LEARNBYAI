const express = require('express');
const router = express.Router();

const { register, login, logout,verifyEmail,resendVerifyEmail,resetPassword,forgotPassword,refresh,
 } = require('../controllers/authController');
const {authenticateUser} = require('../middleware/authentication')

const validateRequest= require('../middleware/validate')

const {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  resendVerifyEmailSchema,
  resetPasswordSchema,
  forgotPasswordSchema,
} = require("../schemas/authSchema");

router.post("/register",validateRequest(registerSchema),register);
router.post("/login",validateRequest(loginSchema),login);
router.delete("/logout",authenticateUser,logout);
router.post("/refresh",refresh);
router.post("/verify-email",validateRequest(verifyEmailSchema),verifyEmail);
router.post("/resend-verify-email",validateRequest(resendVerifyEmailSchema),resendVerifyEmail);
router.post("/reset-password",validateRequest(resetPasswordSchema),resetPassword);
router.post("/forgot-password",validateRequest(forgotPasswordSchema),forgotPassword);

module.exports = router;
