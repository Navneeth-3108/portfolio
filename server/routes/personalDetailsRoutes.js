const express = require("express");
const { getPersonalDetails, updatePersonalDetails } = require("../controllers/personalDetailsController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/")
  .get(getPersonalDetails)
  .put(authMiddleware, updatePersonalDetails);

module.exports = router;