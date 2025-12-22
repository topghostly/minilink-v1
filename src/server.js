import app from "./app.js";

const PORT = process.env.PORT || process.env.DEFAULT_PORT;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
