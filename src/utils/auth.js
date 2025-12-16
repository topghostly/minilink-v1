import AppError from "./error.js";
import bcrypt from "bcrypt";

export const hashPassword = async (password) => {
  try {
    return await bcrypt.hash(password, 10);
  } catch (error) {
    throw new AppError("Hashing password failed", 500, "PASSWORD_HASH_ERROR");
  }
};

export const comparePassword = async (password, hash) => {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    console.log(error);
    throw new AppError(
      "Comparing password failed",
      500,
      "PASSWORD_COMPARE_ERROR"
    );
  }
};
