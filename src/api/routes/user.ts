import { Router } from "express";
const router = Router();
import { login, create } from "../../controllers/userController";

// Define routes for user
// login
router.post("/login", login);

// register/create
router.post("/create", create);

export default router;
