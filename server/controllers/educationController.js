const Education = require("../models/Education");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const { sendSuccess } = require("../utils/response");

const createEducation = asyncHandler(async (req, res) => {
  const education = await Education.create(req.body);
  return sendSuccess(res, 201, "Education entry created successfully", education);
});

const getEducationList = asyncHandler(async (_req, res) => {
  const educationList = await Education.find().sort({ createdAt: -1 });
  return sendSuccess(res, 200, "Education entries fetched successfully", educationList);
});

const getEducationById = asyncHandler(async (req, res, next) => {
  const education = await Education.findById(req.params.id);

  if (!education) {
    return next(new AppError("Education entry not found", 404));
  }

  return sendSuccess(res, 200, "Education entry fetched successfully", education);
});

const updateEducation = asyncHandler(async (req, res, next) => {
  const education = await Education.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!education) {
    return next(new AppError("Education entry not found", 404));
  }

  return sendSuccess(res, 200, "Education entry updated successfully", education);
});

const deleteEducation = asyncHandler(async (req, res, next) => {
  const education = await Education.findByIdAndDelete(req.params.id);

  if (!education) {
    return next(new AppError("Education entry not found", 404));
  }

  return sendSuccess(res, 200, "Education entry deleted successfully", education);
});

module.exports = {
  createEducation,
  getEducationList,
  getEducationById,
  updateEducation,
  deleteEducation,
};
