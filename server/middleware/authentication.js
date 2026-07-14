const CustomError = require("../errors");
const { isTokenValid } = require("../utils");
const Token = require("../models/Token");
const { attachCookiesToResponse } = require("../utils/jwt");

const authenticateUser = async (req, res, next) => {
  const { accessToken, refreshToken } = req.signedCookies;

  try {
    // 1. Access token exists
    if (accessToken) {
      const payload = isTokenValid(accessToken);
      req.user = payload.user;
      return next();
    }

    // 2. No refresh token
    if (!refreshToken) {
      throw new CustomError.UnauthenticatedError("Authentication Invalid");
    }

    // 3. Verify refresh JWT
    const payload = isTokenValid(refreshToken);

    // 4. Verify refresh token in database
    const existingToken = await Token.findOne({
      user: payload.user.userId,
    });

    if (!existingToken || !existingToken.isValid) {
      throw new CustomError.UnauthenticatedError("Authentication Invalid");
    }

    // 5. Attach new cookies
    attachCookiesToResponse({
      res,
      user: payload.user,
      refreshToken: existingToken.refreshToken,
    });

    req.user = payload.user;
    next();
  } catch (error) {
    throw new CustomError.UnauthenticatedError("Authentication Invalid");
  }
};

const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomError.UnauthorizedError(
        "Unauthorized to access this route",
      );
    }

    next();
  };
};

module.exports = {
  authenticateUser,
  authorizePermissions,
};
