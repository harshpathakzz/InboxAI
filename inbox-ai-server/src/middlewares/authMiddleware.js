export const verifyAuth = (req, res, next) => {
  const tokens = req.cookies.tokens;
  if (!tokens) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    JSON.parse(tokens);
    next();
  } catch (err) {
    return res.status(400).json({ error: "Invalid token format" });
  }
};
