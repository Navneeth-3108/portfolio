const Experience = require("../models/Experience");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const { sendSuccess } = require("../utils/response");

const createExperience = asyncHandler(async (req, res) => {
  const experience = await Experience.create(req.body);
  return sendSuccess(res, 201, "Experience created successfully", experience);
});

const getExperiences = asyncHandler(async (_req, res) => {
  const experiences = await Experience.find().sort({ createdAt: -1 });
  return sendSuccess(res, 200, "Experience entries fetched successfully", experiences);
});

const getExperienceById = asyncHandler(async (req, res, next) => {
  const experience = await Experience.findById(req.params.id);

  if (!experience) {
    return next(new AppError("Experience not found", 404));
  }

  return sendSuccess(res, 200, "Experience fetched successfully", experience);
});

const updateExperience = asyncHandler(async (req, res, next) => {
  const experience = await Experience.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!experience) {
    return next(new AppError("Experience not found", 404));
  }

  return sendSuccess(res, 200, "Experience updated successfully", experience);
});

const deleteExperience = asyncHandler(async (req, res, next) => {
  const experience = await Experience.findByIdAndDelete(req.params.id);

  if (!experience) {
    return next(new AppError("Experience not found", 404));
  }

  return sendSuccess(res, 200, "Experience deleted successfully", experience);
});

module.exports = {
  createExperience,
  getExperiences,
  getExperienceById,
  updateExperience,
  deleteExperience,
};
