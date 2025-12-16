import express from "express";
import {
  signIncontroller,
  signUpController,
} from "#controllers/auth.controller.js";

const router = express.Router();

router.post("/sign-up", signUpController);
router.post("/sign-in", signIncontroller);

export default router;
