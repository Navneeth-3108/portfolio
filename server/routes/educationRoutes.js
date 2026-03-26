const express = require("express");
const {
  getEducationList,
  getEducationById,
  createEducation,
  updateEducation,
  deleteEducation,
} = require("../controllers/educationController");
const { validateParams } = require("../middlewares/validate");
const { idParamSchema } = require("../middlewares/schemas");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/")
  .get(getEducationList)
  .post(authMiddleware, createEducation);

router.route("/:id")
  .get(validateParams(idParamSchema), getEducationById)
  .put(authMiddleware, validateParams(idParamSchema), updateEducation)
  .delete(authMiddleware, validateParams(idParamSchema), deleteEducation);

module.exports = router;

