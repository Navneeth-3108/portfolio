const mongoose = require("mongoose");

const personalDetailsSchema = new mongoose.Schema(
  {
    singletonKey: {
      type: String,
      default: "primary",
      unique: true,
      immutable: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    headline: {
      type: String,
      required: true,
      trim: true,
    },
    bio: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    location: {
      type: String,
      trim: true,
    },
    githubLink: {
      type: String,
      trim: true,
    },
    linkedinLink: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PersonalDetails", personalDetailsSchema);