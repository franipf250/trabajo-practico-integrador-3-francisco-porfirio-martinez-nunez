import { Router } from "express";
import {
  createEvent,
  getAllEvents,
  getMyEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} from "../controllers/event.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { ownerOrAdminMiddleware } from "../middlewares/ownerOrAdmin.middleware.js";
import { 
  validateEventCreate, 
  validateEventId 
} from "../middlewares/validation/event.validation.js";

export const eventRouter = Router();

// Crear un evento con sus categorías y validación de datos (usuario autenticado)[cite: 2]
eventRouter.post("/", authMiddleware, validateEventCreate, createEvent);

// Listar los eventos con populate de organizer y categories (usuario autenticado)
eventRouter.get("/", authMiddleware, getAllEvents);

// Listar los eventos del usuario logueado (usuario autenticado)
eventRouter.get("/my", authMiddleware, getMyEvents);

// Obtener un evento por ID con validación del parámetro y populate (usuario autenticado)[cite: 2]
eventRouter.get("/:id", authMiddleware, validateEventId, getEventById);

// Actualizar un evento y sus categorías (solo organizador o admin, valida ID y cuerpo)[cite: 2]
eventRouter.put("/:id", authMiddleware, validateEventId, validateEventCreate, ownerOrAdminMiddleware, updateEvent);

// Eliminación física de un evento (solo organizador o admin, valida ID)[cite: 2]
eventRouter.delete("/:id", authMiddleware, validateEventId, ownerOrAdminMiddleware, deleteEvent);