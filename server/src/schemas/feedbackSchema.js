const z = require("zod");

const nameSchema = z
  .string()
  .trim()
  .min(3, "Must be at least 2 characters")
  .max(50, "Cannot exceed 50 characters");

const emailSchema = z
  .string()
  .trim()
  .email("Invalid email address")
  .max(254);

const messageSchema = z
  .string()
  .trim()
  .min(10, "Message must be at least 10 characters")
  .max(2000, "Message cannot exceed 5000 characters");

const mongoIdSchema = z.object({
  id: z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid MongoDB ObjectId"),
});

const createFeedbackSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  message: messageSchema,
});

module.exports = {
  createFeedbackSchema,
  mongoIdSchema,
};