import { createLinkSchema } from "#validations/links.validation.js";
import { createLink } from "#services/links.service.js";
import AppError from "#utils/error.js";
import { links } from "#models/links.model.js";
import { db } from "../config/database.config.js";
import { eq } from "drizzle-orm";
import { sql } from "drizzle-orm";

export const createLinkController = async (req, res, next) => {
  try {
    console.log(`The request body is ${JSON.stringify(req.body)}`);
    const validated_data = createLinkSchema.safeParse(req.body);
    if (!validated_data.success)
      throw new AppError("Invalid request data", 400, "INVALID_INPUT_DATA");

    console.log(`The validated data is ${JSON.stringify(validated_data.data)}`);

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
        short_link: `${process.env.APP_URL}${link.short_link}`,
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

export const redirectLinkController = async (req, res, next) => {
  const { link } = req.params;

  const redirect_link = await db
    .select({
      original_link: links.original_link,
      click_counts: links.click_count,
    })
    .from(links)
    .where(eq(links.short_link, link))
    .limit(1);

  if (redirect_link.length === 0) {
    throw new AppError("Link not found", 404, "LINK_NOT_FOUND");
  }

  await db
    .update(links)
    .set({
      click_count: sql`click_count + 1`,
    })
    .where(eq(links.short_link, link));

  return res.redirect(302, redirect_link[0].original_link);
};
