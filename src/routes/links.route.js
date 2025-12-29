import express from "express";
import {
  createLinkController,
  getAllUserLinksController,
  getLinkStatsController,
} from "#controllers/links.controller.js";
import { requireAuth } from "#middleware/auth.middleware.js";

const router = express.Router();

router.post("/create", requireAuth, createLinkController);
router.get("/stats/:link", requireAuth, getLinkStatsController);
router.get("/all", requireAuth, getAllUserLinksController);

export default router;
