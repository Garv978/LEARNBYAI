const mongoose = require("mongoose");
const argon2 = require("argon2");
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
    match: [/^\S+@\S+\.\S+$/, "Please provide valid email"],
    maxlength:254, // regex instead of validator
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 255,
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
  passwordToken: String,
  passwordTokenExpirationDate: Date,
});

// Hash password before saving
UserSchema.pre("save", async function () {
  if (!this.password || !this.isModified("password")) return;

  const peppered = this.password + process.env.PASSWORD_PEPPER;

  this.password = await argon2.hash(peppered, {
    type: argon2.argon2id,
    timeCost: Number(process.env.ARGON2_TIME_COST || 3),
    memoryCost: Number(process.env.ARGON2_MEMORY_COST || 65536),
    parallelism: Number(process.env.ARGON2_PARALLELISM || 1),
  });
});

// Compare password
UserSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;

  const peppered = candidatePassword + process.env.PASSWORD_PEPPER;

  const isMatch = await argon2.verify(this.password, peppered);

  // Rehash automatically if stronger parameters are configured
  if (
    isMatch &&
    await argon2.needsRehash(this.password, {
      type: argon2.argon2id,
      timeCost: Number(process.env.ARGON2_TIME_COST || 3),
      memoryCost: Number(process.env.ARGON2_MEMORY_COST || 65536),
      parallelism: Number(process.env.ARGON2_PARALLELISM || 1),
    })
  ) {
    this.password = await argon2.hash(peppered, {
      type: argon2.argon2id,
      timeCost: Number(process.env.ARGON2_TIME_COST || 3),
      memoryCost: Number(process.env.ARGON2_MEMORY_COST || 65536),
      parallelism: Number(process.env.ARGON2_PARALLELISM || 1),
    });

    await this.save();
  }

  return isMatch;
};


// Verification token
UserSchema.methods.createVerificationToken = function () {
  const rawToken = crypto.randomBytes(40).toString("hex");
  this.verificationToken = crypto.createHash("sha256").update(rawToken).digest("hex");
  this.verificationTokenExpiry = new Date(Date.now() + 10 * 60 * 1000);
  return rawToken;
};

UserSchema.methods.isVerificationTokenValid = function (token) {
  const hashedInput = crypto.createHash("sha256").update(token).digest("hex");
  return this.verificationToken === hashedInput && this.verificationTokenExpiry > Date.now();
};

// Password reset token
UserSchema.methods.createPasswordResetToken = function () {
  const rawToken = crypto.randomBytes(40).toString("hex");
  this.passwordToken = crypto.createHash("sha256").update(rawToken).digest("hex");
  this.passwordTokenExpirationDate = new Date(Date.now() + 10 * 60 * 1000);
  return rawToken;
};

UserSchema.methods.isPasswordResetTokenValid = function (token) {
  const hashedInput = crypto.createHash("sha256").update(token).digest("hex");
  return this.passwordToken === hashedInput && this.passwordTokenExpirationDate > Date.now();
};

module.exports = mongoose.model("User", UserSchema);


