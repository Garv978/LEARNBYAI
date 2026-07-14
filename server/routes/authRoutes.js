const express = require('express');
const router = express.Router();

const { register, login, logout,verifyEmail,resetPassword,forgotPassword,refresh,
 } = require('../controllers/authController');
const {authenticateUser} = require('../middleware/authentication')

router.post('/register', register);
router.post('/login', login);
router.delete('/logout', authenticateUser,logout);
router.post('/refresh', refresh)
router.post('/verify-email', verifyEmail)
router.post('/reset-password',resetPassword)
router.post('/forgot-password', forgotPassword)

module.exports = router;
