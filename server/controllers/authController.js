const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { attachCookiesToResponse, createTokenUser } = require("../utils");
const { verify } = require("jsonwebtoken");
const crypto = require("crypto");
const { error } = require("console");
const { sendEmail } = require("../utils");
const Token = require("../models/Token");

import API from "../api.js"

const origin = API;

const register = async (req, res) => {
  const { email, name, password } = req.body;

  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError("Email already exists");
  }

  const role = "user"
  const verificationToken = crypto.randomBytes(40).toString("hex");
  const user = await User.create({
    name,
    email,
    password,
    role,
    verificationToken,
  });

  const verifyEmail = `${origin}/user/verify-email?token=${verificationToken}&email=${user.email}`;
  console.log(verifyEmail);
  await sendEmail({
    to: user.email,
    subject: "Verify Email",
    html: `
    <h2>Welcome ${user.name}</h2>
    <p>Your verification token:</p>
    <h1>${verificationToken}</h1>
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
  if (user.verificationToken !== verificationToken)
    throw new CustomError.UnauthenticatedError("Verification Failed");
  user.isVerified = true;
  user.verified = Date.now();
  user.verificationToken = "";
  await user.save();
  res.status(StatusCodes.OK).json({ msg: "Verified" });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError.BadRequestError({
      msg: "Please provide email and password",
    });
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
    const passwordToken = crypto.randomBytes(40).toString("hex");
    const verifyEmail = `${origin}/user/reset-password?token=${passwordToken}&email=${user.email}`;
    await sendEmail({
      to: user.email,
      subject: "Reset Password",
      html: `
    <h2>Welcome ${user.name} please reset your email by clicking on the</h2>
  <a href="${verifyEmail}">
    Verify Email
  </a>
  `,
    });
    const tenMinutes = 10 * 60 * 1000;
    const passwordExpirationDate = new Date(Date.now() + tenMinutes);
    user.passwordToken = passwordToken;
    user.passwordTokenExpirationDate = passwordExpirationDate;
    await user.save();
  }
  res
    .status(StatusCodes.OK)
    .json({ msg: "Please check your email for resetting your password" });
};

const resetPassword = async (req, res) => {
  const {email,token,newPassword} = req.body
  if(!token || !email || !newPassword)
      throw new CustomError.BadRequestError('Invalid')
  const user = await User.findOne({email})
  if(user){
    const currentDate = Date.now()
    if(user.passwordTokenExpirationDate>currentDate && user.passwordToken===token ){
      user.password = password
      user.passwordToken = null
      useReducer.passwordExpirationDate=null
      await user.save()
    }
  }
};

module.exports = {
  register,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
};
