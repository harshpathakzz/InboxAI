import oAuth2Client from "../config/oauth2Client.js";
import { getUserInfo } from "../services/userInfoService.js";

export const fetchUserInfo = async (req, res) => {
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
    // Fetch user profile (including name, email, and avatar)
    const userInfo = await getUserInfo(oAuth2Client);
    const username = userInfo.names ? userInfo.names[0].displayName : "Unknown";
    const email = userInfo.emailAddresses
      ? userInfo.emailAddresses[0].value
      : null;
    const avatar = userInfo.photos ? userInfo.photos[0].url : null;

    return res.json({ username, email, avatar });
  } catch (err) {
    console.error("Failed to retrieve user info:", err);

    return res.status(500).json({ error: "Failed to retrieve user info" });
  }
};
