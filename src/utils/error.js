class AppError extends Error {
  constructor(message, statusCode, code) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;

    Error.captureStackTrace(this, this.constructor);
  }
}

// if (!user) {
//   throw new AppError("User not found", 404, "USER_NOT_FOUND");
// }

export default AppError;
