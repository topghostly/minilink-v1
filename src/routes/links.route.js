import express from "express";
import {
  createLinkController,
  getAllUserLinksController,
  getLinkStatsController,
  getAllLinksController,
  deleteLinkController,
  editOriginalUrlController,
} from "#controllers/links.controller.js";
import { requireAuth, requireAdmin } from "#middleware/auth.middleware.js";

const router = express.Router();

router.post("/create", requireAuth, createLinkController);
router.get("/stats/:link", requireAuth, getLinkStatsController);
router.get("/all", requireAuth, getAllUserLinksController);
router.delete("/delete/:id", requireAuth, deleteLinkController);
router.patch("/update/:id", requireAuth, editOriginalUrlController);

// Admin Operations
router.get("/admin/all", requireAuth, requireAdmin, getAllLinksController);

export default router;
