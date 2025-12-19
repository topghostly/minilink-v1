import { createLinkSchema } from "#validations/links.validation.js";
import { createLink } from "#services/links.service.js";
import AppError from "#utils/error.js";

export const createLinkController = async (req, res, next) => {
  try {
    const validated_data = createLinkSchema.safeParse(req.body);
    if (!validated_data.success)
      throw new AppError("Invalid request data", 400, "INVALID_INPUT_DATA");

    const { original_link, is_human_readable } = validated_data.data;
    const user_id = req.user.id;
    const link = await createLink({
      user_id,
      original_link,
      is_human_readable,
    });
    res.status(201).json({
      success: true,
      data: {
        id: link.id,
        short_link: link.short_link,
        original_link: link.original_link,
      },
      error: null,
      meta: {
        message: "Link created successfully",
        created_at: link.created_at,
      },
    });
  } catch (error) {
    next(error);
  }
};
