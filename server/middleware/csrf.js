const { doubleCsrf } = require("csrf-csrf");

const {
  generateToken,
  doubleCsrfProtection,
} = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET,

  cookieName: "__Host-csrf-token",

  cookieOptions: {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  },

  size: 64,

  ignoredMethods: ["GET", "HEAD", "OPTIONS"],
});

module.exports = {
  generateToken,
  doubleCsrfProtection,
};