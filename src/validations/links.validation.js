import z from "zod";

export const createLinkSchema = z.object({
  original_link: z.string(),
  is_human_readable: z.coerce.boolean().default(false),
});
