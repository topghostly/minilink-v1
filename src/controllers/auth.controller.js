import AppError from "#utils/error.js";
import { jwtSignUser } from "#utils/jwt.js";
import { signInSchema, signUpSchema } from "#validations/auth.validation.js";
import { authenticateUser, createUser } from "#services/user.service.js";
import { cookies } from "#utils/cookies.js";

export const signUpController = async (req, res, next) => {
  try {
    const validatedData = signUpSchema.safeParse(req.body);

    if (!validatedData.success) {
      throw new AppError("Invalid request data", 400, "INVALID_INPUT_DATA");
    }

    const { name, mail, password, role } = validatedData.data;

    const user = await createUser({ name, mail, role, password });

    jwtSignUser(res, user.id, user.name, user.mail, user.role);

    res.status(201).json({
      success: true,
      data: user,
      error: null,
      meta: {
        message: "User created successfully",
        created_at: user.created_at,
      },
    });
  } catch (error) {
    // throw error instanceof AppError
    //   ? error
    //   : new AppError(
    //       error.message || "Something went wrong",
    //       error.statusCode || 500,
    //       error.code || "INTERNAL_SERVER_ERROR"
    //     );
    next(error);
  }
};

export const signIncontroller = async (req, res, next) => {
  try {
    const validatedData = signInSchema.safeParse(req.body);

    if (!validatedData.success)
      throw new AppError("Invalid request data", 400, "INVALID_INPUT_DATA");

    const { mail, password } = validatedData.data;
    const authenticatedUser = await authenticateUser({ mail, password });

    jwtSignUser(
      res,
      authenticatedUser.id,
      authenticatedUser.name,
      authenticatedUser.mail,
      authenticatedUser.role
    );

    res.status(200).json({
      success: true,
      data: {
        id: authenticatedUser.id,
        name: authenticatedUser.name,
        mail: authenticatedUser.mail,
        role: authenticatedUser.role,
      },
      error: null,
      meta: {
        message: "User signed in successfully",
      },
    });
  } catch (error) {
    next(error);
  }
};

export const signOutController = async (req, res, next) => {
  try {
    cookies.clear(res, "minilink_token");
    res.status(200).json({
      success: true,
      data: null,
      error: null,
      meta: {
        message: "User signed out successfully",
      },
    });
  } catch (error) {
    next(error);
  }
};
