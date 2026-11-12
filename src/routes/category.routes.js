import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategory,
  getCategoryById,
  updateCategory,
} from "../controllers/category.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";
import { 
  categoryCreateValidation, 
  validateCategoryId 
} from "../middlewares/validation/category.validation.js";

export const categoryRouter = Router();

// Crear una categoría (solo admin con validación de datos)[cite: 2]
categoryRouter.post("/", authMiddleware, adminMiddleware, categoryCreateValidation, createCategory);

// Listar las categorías (usuario autenticado)
categoryRouter.get("/", authMiddleware, getAllCategory);

// Obtener una categoría por ID con validación del parámetro y virtual populate de eventos (usuario autenticado)[cite: 2]
categoryRouter.get("/:id", authMiddleware, validateCategoryId, getCategoryById);

// Actualizar una categoría (solo admin, valida ID y cuerpo de la petición)[cite: 2]
categoryRouter.put("/:id", authMiddleware, adminMiddleware, validateCategoryId, categoryCreateValidation, updateCategory);

// Eliminar una categoría con eliminación en cascada (solo admin, valida ID)[cite: 2]
categoryRouter.delete("/:id", authMiddleware, adminMiddleware, validateCategoryId, deleteCategory);