export const errorHandler = (error, req, res, next) => {
  // Default status code is 500 (Internal Server Error)
  const status = error.statusCode || error.status || 500;

  // Default error message
  const message = error.message || "Something went wrong";

  // Send the error response
  res.status(status).json({
    success: false,
    message: message,
  });
};
