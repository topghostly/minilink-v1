import express from "express";
import {
  signIncontroller,
  signUpController,
  signOutController,
  stillLoggedInController,
} from "#controllers/auth.controller.js";
import { requireAuth } from "#middleware/auth.middleware.js";

const router = express.Router();

router.post("/sign-up", signUpController);
router.post("/sign-in", signIncontroller);
router.post("/sign-out", signOutController);
router.get("/me", requireAuth, stillLoggedInController);

export default router;
