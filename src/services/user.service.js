import { users } from "#models/users.model.js";
import { comparePassword, hashPassword } from "#utils/auth.js";
import AppError from "#utils/error.js";
import { eq } from "drizzle-orm";
import { db } from "../config/database.config.js";

export const createUser = async ({ name, mail, password, role = "user" }) => {
  try {
    // Check if user mail alreay exist
    const existinUser = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.mail, mail))
      .limit(1);

    if (existinUser.length > 0) {
      throw new AppError("User already exist", 400, "USER_ALREADY_EXIST");
    }

    const hashedPassword = await hashPassword(password);

    const [newUser] = await db
      .insert(users)
      .values({
        name,
        mail,
        password: hashedPassword,
        role,
      })
      .returning({
        id: users.id,
        name: users.name,
        mail: users.mail,
        role: users.role,
        created_at: users.created_at,
      });

    return newUser;
  } catch (error) {
    if (process.env.NODE_ENV === "development") console.error(error);
    throw error instanceof AppError
      ? error
      : new AppError("User creation failed", 500, "USER_CREATION_FAILED");
  }
};

export const authenticateUser = async ({ mail, password }) => {
  try {
    const existingUser = await db
      .select({
        id: users.id,
        name: users.name,
        mail: users.mail,
        password: users.password,
        role: users.role,
      })
      .from(users)
      .where(eq(users.mail, mail))
      .limit(1);

    if (existingUser.length === 0) {
      throw new AppError(
        "Invalid profile details",
        400,
        "INVALID_PROFILE_DETAILS"
      );
    }

    const [{ password: hashPassword }] = existingUser;

    const isPasswordValid = await comparePassword(password, hashPassword);

    if (!isPasswordValid)
      throw new AppError(
        "Invalid profile details",
        400,
        "INVALID_PROFILE_DETAILS"
      );

    return existingUser[0];
  } catch (error) {
    if (process.env.NODE_ENV === "development") console.error(error);
    throw error instanceof AppError
      ? error
      : new AppError(
          "User authentication failed",
          500,
          "USER_AUTHENTICATION_FAILED"
        );
  }
};
