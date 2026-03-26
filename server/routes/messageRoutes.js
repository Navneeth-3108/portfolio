const express = require("express");
const { createMessage, getMessages, deleteMessage } = require("../controllers/messageController");
const authMiddleware = require("../middlewares/authMiddleware");
const { validateBody } = require("../middlewares/validate");
const { messageCreateSchema } = require("../middlewares/schemas");

const router = express.Router();

router.route("/")
  .post(validateBody(messageCreateSchema), createMessage)
  .get(authMiddleware, getMessages);

router.route("/:id")
  .delete(authMiddleware, deleteMessage);

module.exports = router;
