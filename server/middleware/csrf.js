const crypto = require("node::crypto");
const { doubleCsrf } = require("csrf-csrf");

const {
  generateCsrfToken,
  doubleCsrfProtection,
} = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET,

  getSessionIdentifier: (req) => {
    return req.csrfSessionId || req.cookies?.csrfSessionId;
  },

  cookieName:
    process.env.NODE_ENV === "production"
      ? "__Host-csrf-token"
      : "csrf-token",

  cookieOptions: {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  },

  size: 64,

  ignoredMethods: ["GET", "HEAD", "OPTIONS"],
});

const csrfSessionMiddleware = (req, res, next) => {
  let sessionId = req.cookies?.csrfSessionId;

  if (!sessionId) {
    sessionId = crypto.randomUUID();

    res.cookie("csrfSessionId", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });
  }

  req.csrfSessionId = sessionId;

  next();
};

module.exports = {
  generateCsrfToken,
  doubleCsrfProtection,
  csrfSessionMiddleware,
};