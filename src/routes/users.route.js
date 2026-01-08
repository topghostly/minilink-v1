import express from "express";
import {
  stillLoggedInController,
  deleteUser,
} from "#controllers/users.controller.js";
import { requireAuth } from "#middleware/auth.middleware.js";

const router = express.Router();

router.get("/me", requireAuth, stillLoggedInController);
router.delete("/me", requireAuth, deleteUser);

export default router;
