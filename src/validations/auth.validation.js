import { z } from "zod";

export const signUpSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters long")
    .max(255, "Name must be at most 255 characters long"),
  mail: z
    .string()
    .trim()
    .toLowerCase()
    .email({ message: "Invalid mail address" })
    .max(255, { message: "Mail should be between 255 characters long" }),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(255, { message: "Password is too long" }),
  role: z.enum(["user", "admin"]).default("user"),
});

export const signInSchema = z.object({
  mail: z
    .string()
    .email({ message: "Invalid mail address" })
    .max(255, { message: "Mail should be between 255 characters long" }),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(255, { message: "Password is too long" }),
});
