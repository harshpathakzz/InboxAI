import express from "express";
import { fetchUserInfo } from "../controllers/userInfoController.js";
import { verifyAuth } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/fetchUserInfo", verifyAuth, fetchUserInfo);

export default router;
