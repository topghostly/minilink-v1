import { jwtToken } from "#utils/jwt.js";
import AppError from "#utils/error.js";

export const requireAuth = (req, res, next) => {
  const token = req.cookies?.minilink_token;
  if (!token) {
    throw new AppError("Authentication required", 401, "UNAUTHORIZED");
  }
  try {
    const decodedToken = jwtToken.verify(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    throw new AppError("Invalid or expired token", 401, "INVALID_TOKEN");
  }
};
