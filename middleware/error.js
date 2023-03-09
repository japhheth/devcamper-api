const { ERROR_TYPES } = require("../utils/constants");
const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  console.log(err.stack.red);

  error.message = err.message;

  // Bad mongoose ObjectId
  if (err.name === ERROR_TYPES.CAST_ERROR) {
    const message = `Bootcamp id not found with id of ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  // Duplicate key error
  if (err.code === ERROR_TYPES.DUPLICATE_KEY_ERROR) {
    const message = `Duplicate bootcamp key ${Object.keys(
      err.keyValue
    )}: ${Object.values(err.keyValue)}`;
    error = new ErrorResponse(message, 400);
  }

  // Validatior error
  if (err._message && err._message.includes(ERROR_TYPES.VALIDATOR_ERROR)) {
    const message = err.message;
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
  });
};

module.exports = errorHandler;
