import express from "express";
import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const port = 5000;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const oAuth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(cookieParser());

app.get("/auth/google", (req, res) => {
  const url = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/gmail.readonly"],
  });
  res.redirect(url);
});

app.get("/auth/google/callback", async (req, res) => {
  try {
    const code = req.query.code;
    if (!code) {
      // return res.status(400).json({ error: "Missing code parameter" });
      return res.redirect(`http://localhost:3000/grant-access`);
    }

    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    res.cookie("tokens", JSON.stringify(tokens), {
      httpOnly: false,
      secure: false,
    });

    res.redirect(`http://localhost:3000/dashboard`);
  } catch (err) {
    console.error("Error during Google OAuth callback:", err);
    res.status(500).json({ error: "Failed to authenticate with Google" });
  }
});
app.get("/emails", async (req, res) => {
  const tokens = req.cookies.tokens;
  if (!tokens) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  let access_token;
  try {
    const parsedTokens = JSON.parse(tokens);
    access_token = parsedTokens.access_token;
  } catch (err) {
    return res.status(400).json({ error: "Invalid token format" });
  }

  let gmail;
  try {
    oAuth2Client.setCredentials({ access_token });
    gmail = google.gmail({ version: "v1", auth: oAuth2Client });
  } catch (err) {
    return res.status(500).json({ error: "Failed to create Gmail client" });
  }

  try {
    const maxResults = req.query.maxResults || 10; // Retrieve the maxResults parameter from the query string, or use 10 as the default
    const response = await gmail.users.messages.list({
      userId: "me",
      maxResults: maxResults,
    });
    const messages = response.data.messages || [];
    const emailPromises = messages.map(async (msg) => {
      try {
        const message = await gmail.users.messages.get({
          userId: "me",
          id: msg.id,
        });
        return message.data;
      } catch (err) {
        console.error(`Failed to retrieve email ${msg.id}:`, err);
        return null; // or handle the error differently
      }
    });
    try {
      const emails = await Promise.all(emailPromises);
      res.json(emails);
    } catch (err) {
      console.error("Failed to retrieve emails:", err);
      res.status(500).json({ error: "Failed to retrieve emails" });
    }
  } catch (err) {
    return res.status(500).json({ error: "Failed to retrieve email list" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
