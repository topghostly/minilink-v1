import { jwtToken } from "#utils/jwt.js";
import AppError from "#utils/error.js";

export const requireAuth = (req, res, next) => {
  const token = req.cookies?.minilink_token;
  console.log("The token is", token);
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

export const requireAdmin = (req, res, next) => {
  const user = req.user;
  if (user.role !== "admin") {
    throw new AppError("Admin access required", 403, "ADMIN_ACCESS_REQUIRED");
  }
  next();
};
