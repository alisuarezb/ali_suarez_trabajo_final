//router
import { Router } from "express";
import userController from "../controllers/user.controller.js";
import { validateLoginData } from "../middlewares/auth.middleware.js";

const router = Router();

// POST /auth/login - Autenticar usuario y obtener token
router.post("/login", validateLoginData, userController.loginUser);

export default router;