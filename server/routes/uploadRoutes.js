const express = require("express");
const upload = require("../middlewares/upload");
const authMiddleware = require("../middlewares/authMiddleware");
const { sendSuccess } = require("../utils/response");

const router = express.Router();

router.post("/", authMiddleware, upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }

  // Final Cloudinary-only route
  // req.file.path contains the full secure URL provided by Cloudinary
  return sendSuccess(res, 200, "Image uploaded successfully", {
    url: req.file.path,
    filename: req.file.filename,
    mimetype: req.file.mimetype,
    size: req.file.size
  });
});

module.exports = router;
