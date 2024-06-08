import oAuth2Client from "../config/oauth2Client.js";
import { getGmailService, getEmails } from "../services/gmailService.js";

export const fetchEmails = async (req, res) => {
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

  try {
    oAuth2Client.setCredentials({ access_token });
    const gmail = getGmailService(oAuth2Client);
    const maxResults = req.query.maxResults || 10;
    const emails = await getEmails(gmail, maxResults);
    res.json(emails);
  } catch (err) {
    console.error("Failed to retrieve emails:", err);
    res.status(500).json({ error: "Failed to retrieve emails" });
  }
};
