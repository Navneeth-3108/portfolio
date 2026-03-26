const Project = require("../models/Project");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const { sendSuccess } = require("../utils/response");

const normalizeTechStack = (techStackValue) => {
  if (!techStackValue) {
    return undefined;
  }

  if (Array.isArray(techStackValue)) {
    return techStackValue.filter(Boolean);
  }

  return techStackValue
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

const createProject = asyncHandler(async (req, res) => {
  const projectData = {
    ...req.body,
    techStack: normalizeTechStack(req.body.techStack) || [],
    image: req.body.image || "",
  };

  const project = await Project.create(projectData);

  return sendSuccess(res, 201, "Project created successfully", project);
});

const getProjects = asyncHandler(async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);
  const skip = (page - 1) * limit;

  const filter = {};
  const techStack = normalizeTechStack(req.query.techStack);

  if (techStack?.length) {
    filter.techStack = { $in: techStack };
  }

  const [projects, totalItems] = await Promise.all([
    Project.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Project.countDocuments(filter),
  ]);

  const totalPages = Math.max(Math.ceil(totalItems / limit), 1);

  return sendSuccess(res, 200, "Projects fetched successfully", projects, {
    page,
    limit,
    totalItems,
    totalPages,
  });
});

const getProjectById = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return next(new AppError("Project not found", 404));
  }

  return sendSuccess(res, 200, "Projects fetched successfully", project);
});

const updateProject = asyncHandler(async (req, res, next) => {
  const updateData = { ...req.body };

  const normalizedTechStack = normalizeTechStack(req.body.techStack);
  if (normalizedTechStack) {
    updateData.techStack = normalizedTechStack;
  }

  const project = await Project.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!project) {
    return next(new AppError("Project not found", 404));
  }

  return sendSuccess(res, 200, "Project updated successfully", project);
});

const deleteProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findByIdAndDelete(req.params.id);

  if (!project) {
    return next(new AppError("Project not found", 404));
  }

  return sendSuccess(res, 200, "Project deleted successfully", project);
});

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
