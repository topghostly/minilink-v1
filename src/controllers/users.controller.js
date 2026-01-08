import { db } from "../config/database.config.js";
import { users } from "../models/users.model.js";
import { links } from "#models/links.model.js";
import { eq } from "drizzle-orm";
import AppError from "../utils/error.js";

export const stillLoggedInController = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      throw new AppError("Bad or expired token", 404, "BAD_OR_EXPIRED_TOKEN");
    }
    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        mail: user.mail,
        role: user.role,
      },
      error: null,
      meta: {
        message: "User still logged in",
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user_id = req.user.id;

    // Delete all links related to the user
    await db.delete(links).where(eq(links.user_id, user_id));

    // Delete the user
    const result = await db
      .delete(users)
      .where(eq(users.id, user_id))
      .returning({ id: users.id });

    if (result.length === 0) {
      throw new AppError("User not found", 404, "USER_NOT_FOUND");
    }

    return res.json({
      success: true,
      data: null,
      error: null,
      meta: {
        message: "User and all associated links deleted successfully",
      },
    });
  } catch (error) {
    next(error);
  }
};
