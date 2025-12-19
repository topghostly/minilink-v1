import express from "express";
import {
  createLinkController,
  redirectLinkController,
} from "#controllers/links.controller.js";
import { requireAuth } from "#middleware/auth.middleware.js";

const router = express.Router();

router.post("/create-link", requireAuth, createLinkController);

export default router;
