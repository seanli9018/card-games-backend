const express = require("express");
const app = express();
app.use(express.json());

// All your routes and middleware
app.get("/", async (req, res) =>
  res.status(200).json({ message: "API is working!" })
);

module.exports = app; // Export the app to be used in other files
