const PersonalDetails = require("../models/PersonalDetails");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/response");

const PERSONAL_DETAILS_FILTER = { singletonKey: "primary" };

const getPersonalDetails = asyncHandler(async (_req, res) => {
  const personalDetails = await PersonalDetails.findOne(PERSONAL_DETAILS_FILTER);

  return sendSuccess(res, 200, "Personal details fetched successfully", personalDetails);
});

const updatePersonalDetails = asyncHandler(async (req, res) => {
  const personalDetails = await PersonalDetails.findOneAndUpdate(
    PERSONAL_DETAILS_FILTER,
    { $set: req.body },
    { new: true, upsert: true, runValidators: true }
  );

  return sendSuccess(res, 200, "Personal details updated successfully", personalDetails);
});

module.exports = {
  getPersonalDetails,
  updatePersonalDetails,
};