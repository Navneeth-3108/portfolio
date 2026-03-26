const ContactMessage = require("../models/ContactMessage");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/response");
const { sendContactNotification } = require("../utils/mailer");

const createMessage = asyncHandler(async (req, res) => {
  const message = await ContactMessage.create(req.body);

  // Send email notification asynchronously (fire-and-forget)
  // Don't await - email failures won't block successful message submission
  sendContactNotification({
    name: message.name,
    email: message.email,
    subject: message.subject,
    message: message.message,
  }).catch((error) => {
    // Fallback catch for promise chain - shouldn't happen since sendContactNotification
    // doesn't throw, but keeping for safety
    console.error("[Message] Unexpected error in email handler:", error);
  });

  return sendSuccess(res, 201, "Message submitted successfully", message);
});

const getMessages = asyncHandler(async (_req, res) => {
  const messages = await ContactMessage.find().sort({ createdAt: -1 });
  return sendSuccess(res, 200, "Messages fetched successfully", messages);
});

const deleteMessage = asyncHandler(async (req, res) => {
  await ContactMessage.findByIdAndDelete(req.params.id);
  return sendSuccess(res, 200, "Message deleted successfully");
});

module.exports = {
  createMessage,
  getMessages,
  deleteMessage,
};

