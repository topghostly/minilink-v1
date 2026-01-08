import express from "express";
import {
  signIncontroller,
  signUpController,
  signOutController,
} from "#controllers/auth.controller.js";

const router = express.Router();

router.post("/sign-up", signUpController);
router.post("/sign-in", signIncontroller);
router.post("/sign-out", signOutController);

export default router;
