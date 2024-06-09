import express from "express";
import {
  googleAuth,
  googleAuthCallback,
  logout,
} from "../controllers/authController.js";

const router = express.Router();

router.get("/google", googleAuth);
router.get("/google/callback", googleAuthCallback);
router.get("/logout", logout);

export default router;
