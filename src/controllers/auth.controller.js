import { cookies } from "#utils/cookies.js";
import AppError from "#utils/error.js";
import { jwtToken } from "#utils/jwt.js";
import { signInSchema, signUpSchema } from "#validations/auth.validation.js";
import { authenticateUser, createUser } from "#services/user.service.js";

export const signUpController = async (req, res) => {
  try {
    const validatedData = signUpSchema.safeParse(req.body);

    if (!validatedData.success) {
      throw new AppError("Invalid request data", 400, "INVALID_INPUT_DATA");
    }

    const { name, mail, password, role } = validatedData.data;

    const user = await createUser({ name, mail, role, password });

    const token = jwtToken.sign({
      id: user.id,
      name: user.name,
      mail: user.mail,
      role: user.role,
    });

    cookies.set(res, "minilink_token", token);

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
    throw error instanceof AppError
      ? error
      : new AppError(
          error.message || "Something went wrong",
          error.statusCode || 500,
          error.code || "INTERNAL_SERVER_ERROR"
        );
  }
};

export const signIncontroller = async (req, res, next) => {
  try {
    const validatedData = signInSchema.safeParse(req.body);

    if (!validatedData.success)
      throw new AppError("Invalid request data", 400, "INVALID_INPUT_DATA");

    const { mail, password } = validatedData.data;
    const authenticatedUser = await authenticateUser({ mail, password });

    const token = jwtToken.sign({
      id: authenticatedUser.id,
      name: authenticatedUser.name,
      mail: authenticatedUser.mail,
      role: authenticatedUser.role,
    });

    cookies.set(res, "minilink_token", token);

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
    // throw error instanceof AppError
    //   ? error
    //   : new AppError(
    //       error.message || "Couldn't sign in user ",
    //       error.statusCode || 500,
    //       error.code || "SIGN_IN_ERROR"
    //     );
    next(error);
  }
};
