import { Router } from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";
import { 
  validateRegister, 
  validateMongoId 
} from "../middlewares/validation/user.validation.js";

export const userRouter = Router();

// Todas las rutas de usuarios requieren autenticación y rol de administrador
userRouter.use(authMiddleware, adminMiddleware);

// Ruta para crear un usuario con validación de datos
userRouter.post("/", validateRegister, createUser);

// Listar los usuarios activos con el virtual populate events
userRouter.get("/", getAllUsers);

// Obtener un usuario activo con sus eventos (valida que el ID sea un ObjectId correcto)
userRouter.get("/:id", validateMongoId, getUserById);

// Actualizar un usuario (valida que el ID sea un ObjectId correcto)
userRouter.put("/:id", validateMongoId, updateUser);

// Eliminación lógica del usuario con eliminación en cascada de sus eventos (valida que el ID sea un ObjectId correcto)
userRouter.delete("/:id", validateMongoId, deleteUser);