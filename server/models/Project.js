const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    techStack: {
      type: [String],
      default: [],
    },
    githubLink: {
      type: String,
      trim: true,
    },
    liveLink: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
