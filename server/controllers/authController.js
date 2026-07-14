const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const {
  attachCookiesToResponse,
  createTokenUser,
  isTokenValid,
} = require("../utils");
const crypto = require("crypto");
const { sendEmail } = require("../utils");
const Token = require("../models/Token");
const API = require("../api.js");


const origin = API;

const register = async (req, res) => {
  const { email, name, password } = req.body;

  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError("Email already exists");
  }

  const role = "user";
  const user = await User.create({
    name,
    email,
    password,
    role,
  });
  const rawToken = user.createVerificationToken();
  await user.save();
  const verifyEmail = `${origin}/user/verify-email?token=${rawToken}&email=${user.email}`;
  console.log(verifyEmail);
  await sendEmail({
    to: user.email,
    subject: "Verify Email",
    html: `
    <h2>Welcome ${user.name}</h2>
    <p>Your verification token:</p>
    <h1>${rawToken}</h1>
  <a href="${verifyEmail}">
    Verify Email
  </a>
  `,
  });

  res.status(StatusCodes.CREATED).json({ msg: "CREATED" });
};

const verifyEmail = async (req, res) => {
  const { verificationToken, email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new CustomError.NotFoundError("User Not Registered");

  const isValid = user.isVerificationTokenValid(verificationToken);
  if (!isValid)
    throw new CustomError.UnauthenticatedError("Verification Failed");
  user.isVerified = true;
  user.verified = new Date();
  user.verificationToken = null;
  await user.save();
  res.status(StatusCodes.OK).json({ msg: "Verified" });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError.BadRequestError("Please provide email and password");
  }
  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
  }
  if (!user.isVerified)
    throw new CustomError.UnauthenticatedError("Please verify your email! ");
  const tokenUser = createTokenUser(user);

  //create refresh token
  let refreshToken = "";
  //check for existing token
  const existingToken = await Token.findOne({ user: user._id });
  if (existingToken) {
    const { isValid } = existingToken;

    if (!isValid)
      throw new CustomError.UnauthenticatedError("Invalid Credentials");

    refreshToken = existingToken.refreshToken;
    attachCookiesToResponse({ res, user: tokenUser, refreshToken });

    res.status(StatusCodes.OK).json({ user: tokenUser });
    return;
  }
  refreshToken = crypto.randomBytes(40).toString("hex");
  const userAgent = req.headers["user-agent"];
  const ip = req.ip;
  const userToken = { refreshToken, ip, userAgent, user: user._id };
  const token = await Token.create(userToken);

  attachCookiesToResponse({ res, user: tokenUser, refreshToken });

  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const logout = async (req, res) => {
  await Token.findOneAndDelete({ user: req.user.userId });
  res.cookie("accessToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.cookie("refreshToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: "user logged out!" });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) throw new CustomError.BadRequestError("Please provide Email");
  const user = await User.findOne({ email: email });
  if (user) {
    const passwordToken = user.createPasswordResetToken();
    await user.save();
    const resetLink = `${origin}/user/reset-password?token=${passwordToken}&email=${user.email}`;
    await sendEmail({
      to: user.email,
      subject: "Reset Password",
      html: `
    <h2>Hello ${user.name}, please reset your password by clicking below:</h2>
  <a href="${resetLink}">
    Reset Password
  </a>
  `,
    });
  }
  res
    .status(StatusCodes.OK)
    .json({ msg: "Please check your email for resetting your password" });
};

const resetPassword = async (req, res) => {
  const { email, token, newPassword } = req.body;
  if (!token || !email || !newPassword)
    throw new CustomError.BadRequestError("Invalid");
  const user = await User.findOne({ email });
if (!user)
    throw new CustomError.NotFoundError("User not found");
  if (user) {
    const isValid = user.isPasswordResetTokenValid(token);
    if(!isValid)
        throw new CustomError.UnauthenticatedError('Invalid  or expired Token');
      user.password = newPassword;
      user.passwordToken = null;
      user.passwordTokenExpirationDate = null;
      await user.save();
  res.status(StatusCodes.OK).json({ msg: "Password reset successful" });

  }
};

const refresh = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    throw new CustomError.UnauthenticatedError("Invalid Authentication");
  }

  let payload;
  try {
    payload = isTokenValid(refreshToken); // returns decoded payload
  } catch (err) {
    throw new CustomError.UnauthenticatedError("Authentication invalid");
  }

  const existingToken = await Token.findOne({ user: payload.user.userId,refreshToken: payload.refreshToken, });
  if (!existingToken || !existingToken.isValid) {
    throw new CustomError.UnauthenticatedError("Authentication invalid");
  }

  attachCookiesToResponse({
    res,
    user: {
      userId: payload.user.userId,
      name: payload.user.name,
      role: payload.user.role,
    },
    refreshToken,
  });

  res.status(StatusCodes.OK).json({ success: true });
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
