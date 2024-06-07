import express from "express";
import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 5000;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const oAuth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

app.use(cors());

app.get("/auth/google", (req, res) => {
  const url = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/gmail.readonly"],
  });
  res.redirect(url);
});

app.get("/auth/google/callback", async (req, res) => {
  const code = req.query.code;
  const { tokens } = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(tokens);
  res.redirect(`http://localhost:3000?tokens=${JSON.stringify(tokens)}`);
});

app.get("/emails", async (req, res) => {
  const { access_token } = req.query;
  oAuth2Client.setCredentials({ access_token });
  const gmail = google.gmail({ version: "v1", auth: oAuth2Client });
  const response = await gmail.users.messages.list({
    userId: "me",
    maxResults: 10,
  });
  const messages = response.data.messages || [];
  const emailPromises = messages.map(async (msg) => {
    const message = await gmail.users.messages.get({
      userId: "me",
      id: msg.id,
    });
    return message.data;
  });
  const emails = await Promise.all(emailPromises);
  res.json(emails);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
