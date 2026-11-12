import { body, param } from "express-validator";
import { validateResult } from "./validate.js"; 

export const categoryCreateValidation = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 30 })
    .withMessage("El nombre de la categoría debe tener entre 2 y 30 caracteres"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("La descripción no puede superar los 200 caracteres"),
  validateResult,
];

export const validateCategoryId = [
  param("id").isMongoId().withMessage("ID de categoría inválido"),
  validateResult,
];