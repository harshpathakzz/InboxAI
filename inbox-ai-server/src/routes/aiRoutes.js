import express from "express";
import { classifyEmail } from "../controllers/aiController.js";
import { verifyAuth } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.post("/classify-email", classifyEmail);
export default router;
