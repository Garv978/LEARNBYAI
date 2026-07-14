const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const {
  attachCookiesToResponse,
  createTokenUser,
  isTokenValid,
  createJWT,
} = require("../utils");
const crypto = require("crypto");
const { sendEmail } = require("../utils");
const Token = require("../models/Token");

const origin = process.env.FRONTEND_URL || "http://localhost:5173";

const register = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: "All fields are required" });
    }

    const emailAlreadyExists = await User.findOne({ email });
    if (emailAlreadyExists) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: "Email already exists" });
    }

    const role = "user";
    const user = await User.create({ name, email, password, role });
    const rawToken = user.createVerificationToken();
    await user.save();

    const verifyEmail = `${origin}/verify-email?token=${rawToken}&email=${user.email}`;
    await sendEmail({
      to: user.email,
      subject: "Verify Email",
      html: `
        <h2>Welcome ${user.name}</h2>
        <p>Your verification token:</p>
        <h1>${rawToken}</h1>
        <a href="${verifyEmail}">Verify Email</a>
      `,
    });

    res
      .status(StatusCodes.CREATED)
      .json({ success: true, message: "Registration successful. Please check your email to verify your account." });
  } catch (err) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: err.message || "Server error" });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { verificationToken, email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: "User not registered" });
    }

    const isValid = user.isVerificationTokenValid(verificationToken);
    if (!isValid) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ success: false, message: "Verification failed" });
    }

    user.isVerified = true;
    user.verified = new Date();
    user.verificationToken = null;
    await user.save();

    res.status(StatusCodes.OK).json({ success: true, message: "Email verified successfully" });
  } catch (err) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: err.message || "Server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: "Please provide email and password" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ success: false, message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ success: false, message: "Please verify your email first" });
    }

    const tokenUser = createTokenUser(user);

    let refreshToken = "";
    const existingToken = await Token.findOne({ user: user._id });
    if (existingToken) {
      if (!existingToken.isValid) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ success: false, message: "Invalid credentials" });
      }
      refreshToken = existingToken.refreshToken;
      attachCookiesToResponse({ res, user: tokenUser, refreshToken });
      return res.status(StatusCodes.OK).json({ success: true, user: tokenUser,accessToken : createJWT({ payload: { user: tokenUser }, expiresIn: "15m" }) });
    }

    refreshToken = crypto.randomBytes(40).toString("hex");
    const userAgent = req.headers["user-agent"];
    const ip = req.ip;
    await Token.create({ refreshToken, ip, userAgent, user: user._id });

    attachCookiesToResponse({ res, user: tokenUser, refreshToken });
    res.status(StatusCodes.OK).json({ success: true, user: tokenUser });
  } catch (err) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: err.message || "Server error" });
  }
};

const logout = async (req, res) => {
  try {
    await Token.findOneAndDelete({ user: req.user.userId });
    res.cookie("accessToken", "logout", {
      httpOnly: true,
      expires: new Date(Date.now()),
    });
    res.cookie("refreshToken", "logout", {
      httpOnly: true,
      expires: new Date(Date.now()),
    });
    res.status(StatusCodes.OK).json({ success: true, message: "User logged out" });
  } catch (err) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: err.message || "Server error" });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: "Please provide email" });
    }

    const user = await User.findOne({ email });
    if (user) {
      const passwordToken = user.createPasswordResetToken();
      await user.save();
      const resetLink = `${origin}/reset-password?token=${passwordToken}&email=${user.email}`;
      await sendEmail({
        to: user.email,
        subject: "Reset Password",
        html: `
          <h2>Hello ${user.name}, please reset your password by clicking below:</h2>
          <a href="${resetLink}">Reset Password</a>
        `,
      });
    }

    res.status(StatusCodes.OK).json({ success: true, message: "Please check your email for resetting your password" });
  } catch (err) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: err.message || "Server error" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;
    if (!token || !email || !newPassword) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: "Invalid request" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: "User not found" });
    }

    const isValid = user.isPasswordResetTokenValid(token);
    if (!isValid) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ success: false, message: "Invalid or expired token" });
    }

    user.password = newPassword;
    user.passwordToken = null;
    user.passwordTokenExpirationDate = null;
    await user.save();

    res.status(StatusCodes.OK).json({ success: true, message: "Password reset successful" });
  } catch (err) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: err.message || "Server error" });
  }
};
const refresh = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    throw new CustomError.UnauthenticatedError("Invalid Authentication");
  }

  let payload;
  try {
    payload = isTokenValid(refreshToken); // decoded { user, refreshToken }
  } catch (err) {
    throw new CustomError.UnauthenticatedError("Authentication invalid");
  }

  const existingToken = await Token.findOne({
    user: payload.user.userId,
    refreshToken: payload.refreshToken,
  });
  if (!existingToken || !existingToken.isValid) {
    throw new CustomError.UnauthenticatedError("Authentication invalid");
  }

  // Issue new access token
  const newAccessToken = createJWT({
    payload: { user: payload.user },
    expiresIn: "15m",
  });

  // Re‑attach cookies (optional, keeps them fresh)
  attachCookiesToResponse({
    res,
    user: payload.user,
    refreshToken: payload.refreshToken,
  });

  // Return new access token in JSON
  res.status(StatusCodes.OK).json({
    success: true,
    accessToken: newAccessToken,
  });
};


module.exports = {
  register,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  refresh,
};
