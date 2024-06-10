import oAuth2Client from "../config/oauth2Client.js";

export const googleAuth = (req, res) => {
  const url = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/gmail.readonly",
      "https://www.googleapis.com/auth/userinfo.profile",
    ],
  });
  res.redirect(url);
};

export const googleAuthCallback = async (req, res) => {
  try {
    const code = req.query.code;
    if (!code) {
      return res.redirect("https://inbox-ai-lac.vercel.app");
    }
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    res.cookie("tokens", JSON.stringify(tokens), {
      httpOnly: false,
      secure: false,
    });
    console.info("tokens: ", tokens);
    console.info("Successfully authenticated with Google");
    res.redirect("https://inbox-ai-lac.vercel.app/dashboard");
  } catch (err) {
    console.error("Error during Google OAuth callback:", err);
    res.status(500).json({ error: "Failed to authenticate with Google" });
  }
};

export const logout = async (req, res) => {
  try {
    const tokens = req.cookies.tokens ? JSON.parse(req.cookies.tokens) : null;

    if (tokens) {
      const { access_token } = tokens;

      // Revoke the token on Google's side
      if (access_token) {
        await oAuth2Client.revokeToken(access_token);
      }
    }

    // Clear the cookies
    res.clearCookie("tokens", {
      httpOnly: true,
      secure: true,
    });

    res.redirect("https://inbox-ai-lac.vercel.app");
  } catch (err) {
    console.error("Error during logout:", err);
    res.status(500).json({ error: "Failed to logout" });
  }
};
