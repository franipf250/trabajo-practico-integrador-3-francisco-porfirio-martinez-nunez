import { body, param } from "express-validator";
import { validateResult } from "./validate.js";

export const validateEventCreate = [
  body("title")
    .trim()
    .isLength({ min: 3, max: 150 })
    .withMessage("El título debe tener entre 3 y 150 caracteres"),
  body("description")
    .trim()
    .isLength({ min: 20 })
    .withMessage("La descripción debe tener al menos 20 caracteres"),
  body("startDate")
    .isISO8601()
    .toDate()
    .withMessage("Fecha de inicio inválida"),
  body("endDate")
    .isISO8601()
    .toDate()
    .withMessage("Fecha de fin inválida")
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.startDate)) {
        throw new Error("La fecha de fin (endDate) debe ser posterior a la fecha de inicio (startDate)");
      }
      return true;
    }),
  body("capacity")
    .isInt({ min: 1 })
    .withMessage("La capacidad debe ser un número entero mayor o igual a 1"),
  body("price")
    .isNumeric()
    .custom((value) => value >= 0)
    .withMessage("El precio debe ser un número mayor o igual a 0"),
  body("status")
    .optional()
    .isIn(["scheduled", "cancelled", "finished"])
    .withMessage("Estado no válido"),
  // Ubicación embebida
  body("location.venue")
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("El lugar (venue) debe tener entre 3 y 100 caracteres"),
  body("location.address")
    .trim()
    .isLength({ min: 5, max: 150 })
    .withMessage("La dirección debe tener entre 5 y 150 caracteres"),
  body("location.city")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("La ciudad debe tener entre 2 y 50 caracteres"),
  // Categorías (array de ObjectIds válidos)
  body("categories")
    .optional()
    .isArray()
    .withMessage("Las categorías deben enviarse en un array"),
  body("categories.*")
    .optional()
    .isMongoId()
    .withMessage("Cada categoría debe ser un ID de MongoDB válido"),
  validateResult,
];

export const validateEventId = [
  param("id").isMongoId().withMessage("ID de evento inválido"),
  validateResult,
];