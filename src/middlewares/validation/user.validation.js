import { body, param } from "express-validator";
import { validateResult } from "./validate.js";

export const validateRegister = [
  body("username")
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage("El username debe tener entre 3 y 20 caracteres")
    .isAlphanumeric()
    .withMessage("El username debe ser alfanumérico"),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Debe ser un correo electrónico válido"),
  body("password")
    .isString()
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener al menos 8 caracteres")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("La contraseña debe contener al menos una mayúscula, una minúscula y un número"),
  body("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("El rol debe ser 'user' o 'admin'"),
  // Perfil embebido (1:1)
  body("profile.firstName")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("El nombre debe tener entre 2 y 50 caracteres")
    .isAlpha("es", { ignore: " " })
    .withMessage("El nombre solo debe contener letras"),
  body("profile.lastName")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("El apellido debe tener entre 2 y 50 caracteres")
    .isAlpha("es", { ignore: " " })
    .withMessage("El apellido solo debe contener letras"),
  body("profile.birthDate")
    .optional()
    .isISO8601()
    .toDate()
    .custom((value) => {
      if (value > new Date()) {
        throw new Error("La fecha de nacimiento no puede ser futura");
      }
      return true;
    }),
  body("profile.phone")
    .optional()
    .isNumeric()
    .withMessage("El teléfono solo debe contener números")
    .isLength({ min: 8, max: 15 })
    .withMessage("El teléfono debe tener entre 8 y 15 dígitos"),
  validateResult,
];

export const validateLogin = [
  body("email").trim().isEmail().withMessage("Debe ser un correo electrónico válido"),
  body("password").notEmpty().withMessage("La contraseña es obligatoria"),
  validateResult,
];

export const validateMongoId = [
  param("id").isMongoId().withMessage("ID de MongoDB inválido"),
  validateResult,
];