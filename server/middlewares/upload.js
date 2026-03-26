const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const AppError = require("../utils/AppError");

// Configure Cloudinary
const isCloudinaryConfigured = 
  process.env.CLOUDINARY_CLOUD_NAME && 
  process.env.CLOUDINARY_API_KEY && 
  process.env.CLOUDINARY_API_SECRET;

if (!isCloudinaryConfigured) {
  // Silent warning, uploads will fail downstream
} else {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

const storage = isCloudinaryConfigured 
  ? new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: "portfolio/projects",
        allowed_formats: ["jpg", "png", "jpeg", "webp"],
      },
    })
  : multer.memoryStorage(); // Fallback to memory storage if not configured (uploads will still fail downstream or be handled)

const fileFilter = (_req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
    return;
  }
  cb(new AppError("Only image files are allowed", 400));
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

module.exports = upload;
