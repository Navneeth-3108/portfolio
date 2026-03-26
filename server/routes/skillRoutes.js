const express = require("express");
const {
  getSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill,
} = require("../controllers/skillController");
const { validateParams } = require("../middlewares/validate");
const { idParamSchema } = require("../middlewares/schemas");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/")
  .get(getSkills)
  .post(authMiddleware, createSkill);

router.route("/:id")
  .get(validateParams(idParamSchema), getSkillById)
  .put(authMiddleware, validateParams(idParamSchema), updateSkill)
  .delete(authMiddleware, validateParams(idParamSchema), deleteSkill);

module.exports = router;

