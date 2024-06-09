import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import emailRoutes from "./routes/emailRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import userInfoRoutes from "./routes/userInfoRoutes.js";

const app = express();
app.use(cors({ credentials: true, origin: "https://inbox-ai-lac.vercel.app" }));
app.use(cookieParser());
app.use(bodyParser.json());

app.use("/auth", authRoutes);
app.use("/", emailRoutes);
app.use("/ai", aiRoutes);
app.use("/user", userInfoRoutes);

export default app;
