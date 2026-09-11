const z = require("zod");

const passwordSchema = z.string().min(8).max(255);

const emailSchema = z
  .string()
  .trim()
  .email()
  .max(254);

const nameSchema = z
  .string()
  .trim()
  .min(3)
  .max(50);

const tokenSchema = z
  .string()
  .trim()
  .min(1)
  .max(200);

const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});

const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

const verifyEmailSchema = z.object({
  verificationToken: tokenSchema,
  email: emailSchema,
});

const resendVerifyEmailSchema = z.object({
  email: emailSchema,
});

const resetPasswordSchema = z.object({
  email: emailSchema,
  token: tokenSchema,
  newPassword: passwordSchema,
});

const forgotPasswordSchema = z.object({
  email: emailSchema,
});

module.exports = {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  resendVerifyEmailSchema,
  resetPasswordSchema,
  forgotPasswordSchema,
};