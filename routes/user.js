const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Define routes for user

// login
router.post("/login", userController.login);

// register/create
router.post("/create", (req, res) => {
  res.send("create a user");
});

module.exports = router;
