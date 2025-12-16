import jwt from "jsonwebtoken";
import AppError from "./error.js";

const JWT_SECRET = process.env.JWT_SECRET_PHRASE || "default-secret-phrase";

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

export const jwtToken = {
  sign: (payload) => {
    try {
      return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    } catch (error) {
      throw new AppError(
        "Failed to generate JWT token",
        500,
        "JWT_GENERATION_FAILED"
      );
    }
  },
  verify: (token) => {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new AppError(
        "Failed to verify JWT token",
        401,
        "JWT_VERIFICATION_FAILED"
      );
    }
  },
};
