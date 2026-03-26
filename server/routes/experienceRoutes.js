const express = require("express");
const {
  getExperiences,
  getExperienceById,
  createExperience,
  updateExperience,
  deleteExperience,
} = require("../controllers/experienceController");
const { validateParams } = require("../middlewares/validate");
const { idParamSchema } = require("../middlewares/schemas");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/")
  .get(getExperiences)
  .post(authMiddleware, createExperience);

router.route("/:id")
  .get(validateParams(idParamSchema), getExperienceById)
  .put(authMiddleware, validateParams(idParamSchema), updateExperience)
  .delete(authMiddleware, validateParams(idParamSchema), deleteExperience);

module.exports = router;

