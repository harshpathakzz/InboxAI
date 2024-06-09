import app from "./app.js";

const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Server is running");
});
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
