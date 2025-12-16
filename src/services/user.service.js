import { users } from "#models/users.model.js";
import { hashPassword } from "#utils/auth.js";
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
