import { Router } from "express";
import {
  register,
  login,
  profile,
  updateProfile,
  logout,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { 
  validateRegister, 
  validateLogin 
} from "../middlewares/validation/user.validation.js";

export const authRouter = Router();

// ==========================================
// RUTAS PÚBLICAS
// ==========================================

// Registro de usuario con perfil embebido y validación de datos
authRouter.post("/register", validateRegister, register);

// Login con validación de credenciales y JWT enviado como cookie segura
authRouter.post("/login", validateLogin, login);


// ==========================================
// RUTAS PRIVADAS (Requieren autenticación)
// ==========================================

// Obtener el perfil del usuario autenticado
authRouter.get("/profile", authMiddleware, profile);

// Actualizar el perfil embebido del usuario autenticado
authRouter.put("/profile", authMiddleware, updateProfile);

// Logout limpiando la cookie de autenticación
authRouter.post("/logout", authMiddleware, logout);