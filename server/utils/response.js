const sendSuccess = (res, statusCode, message, data, meta) => {
  const payload = {
    success: true,
    message,
    data,
  };

  if (meta) {
    payload.meta = meta;
  }

  return res.status(statusCode).json(payload);
};

module.exports = {
  sendSuccess,
};
