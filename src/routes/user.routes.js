//router
import { Router } from "express";
import userController from "../controllers/user.controller.js";
import { 
  authMiddleware, 
  requireAdmin, 
  validateUserData 
} from "../middlewares/auth.middleware.js";

const router = Router();

// Rutas públicas
// POST /users/register - Registrar nuevo usuario
router.post("/register", validateUserData, userController.createUser);

// Rutas protegidas (requieren autenticación)
// GET /users/profile - Obtener perfil del usuario autenticado
router.get("/profile", authMiddleware, userController.getProfile);

// Rutas de administrador
// GET /users - Obtener todos los usuarios (solo admin)
router.get("/", authMiddleware, requireAdmin, userController.getUsers);

// GET /users/:id - Obtener usuario por ID (solo admin)
router.get("/:id", authMiddleware, requireAdmin, userController.getUserById);

export default router;