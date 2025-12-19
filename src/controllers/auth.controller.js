import AppError from "#utils/error.js";
import { jwtSignUser } from "#utils/jwt.js";
import { signInSchema, signUpSchema } from "#validations/auth.validation.js";
import { authenticateUser, createUser } from "#services/user.service.js";
import { cookies } from "#utils/cookies.js";

export const signUpController = async (req, res, next) => {
  try {
    const validated_data = signUpSchema.safeParse(req.body);

    if (!validated_data.success) {
      throw new AppError("Invalid request data", 400, "INVALID_INPUT_DATA");
    }

    const { name, mail, password, role } = validated_data.data;

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
    const validated_data = signInSchema.safeParse(req.body);

    if (!validated_data.success)
      throw new AppError("Invalid request data", 400, "INVALID_INPUT_DATA");

    const { mail, password } = validated_data.data;
    const authenticated_user = await authenticateUser({ mail, password });

    jwtSignUser(
      res,
      authenticated_user.id,
      authenticated_user.name,
      authenticated_user.mail,
      authenticated_user.role
    );

    res.status(200).json({
      success: true,
      data: {
        id: authenticated_user.id,
        name: authenticated_user.name,
        mail: authenticated_user.mail,
        role: authenticated_user.role,
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
