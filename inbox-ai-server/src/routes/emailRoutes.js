import express from "express";
import { fetchEmails } from "../controllers/emailController.js";
import { verifyAuth } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/emails", verifyAuth, fetchEmails);

export default router;
