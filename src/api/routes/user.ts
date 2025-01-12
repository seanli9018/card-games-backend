import { Router } from "express";
const router = Router();
import { login } from "../../controllers/userController";

// Define routes for user
// login
router.post("/login", login);

// register/create
router.post("/create", (_req, res) => {
  res.send("create a user");
});

export default router;
