import { createLinkSchema } from "#validations/links.validation.js";
import { createLink } from "#services/links.service.js";
import AppError from "#utils/error.js";
import { links } from "#models/links.model.js";
import { db } from "../config/database.config.js";
import { eq, and } from "drizzle-orm";
import { sql } from "drizzle-orm";

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

export const getAllUserLinksController = async (req, res, next) => {
  const user_id = req.user.id;

  const all_user_links = await db
    .select({
      id: links.id,
      original_link: links.original_link,
      short_link: links.short_link,
      click_counts: links.click_count,
      created_at: links.created_at,
    })
    .from(links)
    .where(eq(links.user_id, user_id));

  if (all_user_links.length === 0) {
    throw new AppError("No links found", 404, "NO_LINKS_FOUND");
  }

  return res.json({
    success: true,
    data: all_user_links,
    error: null,
    meta: null,
  });
};
export const getLinkStatsController = async (req, res, next) => {
  const { link } = req.params;
  const user_id = req.user.id;

  console.log(user_id);

  const link_stats = await db
    .select({
      original_link: links.original_link,
      click_counts: links.click_count,
    })
    .from(links)
    .where(and(eq(links.short_link, link), eq(links.user_id, user_id)))
    .limit(1);

  if (link_stats.length === 0) {
    throw new AppError("Link not found", 404, "LINK_NOT_FOUND");
  }

  return res.json({
    success: true,
    data: link_stats[0],
    error: null,
    meta: null,
  });
};
