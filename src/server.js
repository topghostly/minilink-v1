import app from "./app.js";

const PORT = process.env.PORT || process.env.DEFAULT_PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
