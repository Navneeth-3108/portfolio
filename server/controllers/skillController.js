const Skill = require("../models/Skill");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const { sendSuccess } = require("../utils/response");

const createSkill = asyncHandler(async (req, res) => {
  const skill = await Skill.create(req.body);
  return sendSuccess(res, 201, "Skill created successfully", skill);
});

const getSkills = asyncHandler(async (_req, res) => {
  const skills = await Skill.find().sort({ category: 1, name: 1 });
  return sendSuccess(res, 200, "Skills fetched successfully", skills);
});

const getSkillById = asyncHandler(async (req, res, next) => {
  const skill = await Skill.findById(req.params.id);

  if (!skill) {
    return next(new AppError("Skill not found", 404));
  }

  return sendSuccess(res, 200, "Skill fetched successfully", skill);
});

const updateSkill = asyncHandler(async (req, res, next) => {
  const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!skill) {
    return next(new AppError("Skill not found", 404));
  }

  return sendSuccess(res, 200, "Skill updated successfully", skill);
});

const deleteSkill = asyncHandler(async (req, res, next) => {
  const skill = await Skill.findByIdAndDelete(req.params.id);

  if (!skill) {
    return next(new AppError("Skill not found", 404));
  }

  return sendSuccess(res, 200, "Skill deleted successfully", skill);
});

module.exports = {
  createSkill,
  getSkills,
  getSkillById,
  updateSkill,
  deleteSkill,
};
