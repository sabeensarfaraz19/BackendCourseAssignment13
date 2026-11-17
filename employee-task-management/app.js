const express = require("express");
const path = require("path");
const app = express();
const taskRoutes = require("./routes/taskRoutes");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/api/tasks", taskRoutes);


app.use("/api", (req, res) => {
  res.status(404).json({ success: false, message: "API route not found" });
});

module.exports = app;
