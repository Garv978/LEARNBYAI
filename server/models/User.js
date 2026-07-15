const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Please provide email"],
    validate: {
      validator: validator.isEmail,
      message: "Please provide valid email",
    },
  },
  password: {
    type: String,
    required:true,
    minlength: 6,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  verificationToken: String,
  verificationTokenExpiry: Date,
  isVerified: {
    type: Boolean,
    default: false,
  },
  verified: Date,
  passwordToken: {
    type: String,
  },
  passwordTokenExpirationDate: {
    type: Date,
  },
});

UserSchema.pre("save", async function () {
  if (!this.password || !this.isModified("password")) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) {
    return false;
  }
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

UserSchema.methods.createVerificationToken = function () {
  const rawToken = crypto.randomBytes(40).toString("hex");
  this.verificationToken = crypto.createHash("sha256").update(rawToken).digest("hex");
  this.verificationTokenExpiry = new Date(Date.now() + 10*60*1000);
  return rawToken; // send this in email
};

// Verify tokens by hashing input
UserSchema.methods.isVerificationTokenValid = function (token) {
  const hashedInput = crypto.createHash("sha256").update(token).digest("hex");
  return this.verificationToken === hashedInput && this.verificationTokenExpiry > Date.now();
};


// Generate and hash password reset token
UserSchema.methods.createPasswordResetToken = function () {
  const rawToken = crypto.randomBytes(40).toString("hex");
  this.passwordToken = crypto.createHash("sha256").update(rawToken).digest("hex");
  this.passwordTokenExpirationDate = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  return rawToken; // send this in email
};


UserSchema.methods.isPasswordResetTokenValid = function (token) {
  const hashedInput = crypto.createHash("sha256").update(token).digest("hex");
  return (
    this.passwordToken === hashedInput &&
    this.passwordTokenExpirationDate > Date.now()
  );
};

module.exports = mongoose.model("User", UserSchema);
