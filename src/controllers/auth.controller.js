import { cookies } from "#utils/cookies.js";
import AppError from "#utils/error.js";
import { jwtToken } from "#utils/jwt.js";
import { signUpSchema } from "#validations/auth.validation.js";
import { createUser } from "#services/user.service.js";

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
    console.log(`At contorller ${error}`);
    throw new AppError(
      error.message || "Something went wrong",
      error.statusCode || 500,
      error.code || "INTERNAL_SERVER_ERROR"
    );
  }
};
