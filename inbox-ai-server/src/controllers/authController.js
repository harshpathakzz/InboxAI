import oAuth2Client from "../config/oauth2Client.js";

export const googleAuth = (req, res) => {
  const url = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/gmail.readonly"],
  });
  res.redirect(url);
};

export const googleAuthCallback = async (req, res) => {
  try {
    const code = req.query.code;
    if (!code) {
      return res.redirect("http://localhost:3000/grant-access");
    }
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    res.cookie("tokens", JSON.stringify(tokens), {
      httpOnly: true,
      secure: true,
    });
    res.redirect("http://localhost:3000/dashboard");
  } catch (err) {
    console.error("Error during Google OAuth callback:", err);
    res.status(500).json({ error: "Failed to authenticate with Google" });
  }
};