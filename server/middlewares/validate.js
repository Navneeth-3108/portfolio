const AppError = require("../utils/AppError");

const formatValidationErrors = (error) =>
  error.details.map((detail) => detail.message).join(", ");

const validate = (schema, property = "body") => (req, _res, next) => {
  const { error, value } = schema.validate(req[property], {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    return next(new AppError(formatValidationErrors(error), 400));
  }

  req[property] = value;
  return next();
};

module.exports = {
  validateBody: (schema) => validate(schema, "body"),
  validateQuery: (schema) => validate(schema, "query"),
  validateParams: (schema) => validate(schema, "params"),
};
