const express = require("express");
const cors = require("cors");
const app = express();

// Add middleware to parse JSON and URL-encoded data
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.use(cors());

// user
const userRoutes = require("../routes/user");
app.use("/user", userRoutes);

// All your routes and middleware
app.get("/", async (req, res) =>
  res.status(200).json({ message: "API is working!" })
);

module.exports = app; // Export the app to be used in other files
