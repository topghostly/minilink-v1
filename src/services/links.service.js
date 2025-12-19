import { nanoid } from "nanoid";
import {
  uniqueNamesGenerator,
  adjectives,
  animals,
  colors,
} from "unique-names-generator";
// import { db } from "#config/database.config.js";
import { db } from "../config/database.config.js";
import { eq } from "drizzle-orm";
import { links } from "#models/links.model.js";

const isShortLinkExist = async (shortLink) => {
  const existing_link = await db
    .select({ id: links.id })
    .from(links)
    .where(eq(links.short_link, shortLink))
    .limit(1);

  return existing_link.length > 0;
};

const createHumanReadableShortLink = () => {
  const shortLink = uniqueNamesGenerator({
    dictionaries: [adjectives, colors, animals],
    length: 3,
    separator: "-",
    style: "lowerCase",
  });

  return shortLink;
};

const createDefaultShortLink = () => {
  const shortLink = nanoid(7);
  return shortLink;
};

const createShortLink = async ({ is_human_readable }) => {
  if (!is_human_readable) {
    let short_link = createDefaultShortLink();

    while (await isShortLinkExist(short_link)) {
      short_link = createDefaultShortLink();
    }
    return short_link;
  }
  let short_link = createHumanReadableShortLink();

  while (await isShortLinkExist(short_link)) {
    short_link = createHumanReadableShortLink();
  }
  return short_link;
};

export const createLink = async ({
  user_id,
  original_link,
  is_human_readable,
}) => {
  const short_link = await createShortLink({ is_human_readable });
  const [link] = await db
    .insert(links)
    .values({
      user_id,
      original_link,
      short_link: process.env.APP_URL + short_link,
    })
    .returning({
      id: links.id,
      original_link: links.original_link,
      short_link: links.short_link,
      created_at: links.created_at,
    });
  return link;
};
