const express = require("express");
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");
const { validateQuery, validateParams } = require("../middlewares/validate");
const {
  idParamSchema,
  listProjectsQuerySchema,
} = require("../middlewares/schemas");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/")
  .get(validateQuery(listProjectsQuerySchema), getProjects)
  .post(authMiddleware, createProject);

router.route("/:id")
  .get(validateParams(idParamSchema), getProjectById)
  .put(authMiddleware, validateParams(idParamSchema), updateProject)
  .delete(authMiddleware, validateParams(idParamSchema), deleteProject);

module.exports = router;

