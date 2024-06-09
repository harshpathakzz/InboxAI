import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import emailRoutes from "./routes/emailRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

const app = express();
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(cookieParser());
app.use(bodyParser.json());

app.use("/auth", authRoutes);
app.use("/", emailRoutes);
app.use("/ai", aiRoutes);

export default app;
