import { validationResult } from "express-validator";

/**
 * Middleware para validar los resultados de express-validator.
 * Si hay errores, retorna un código 400 y el detalle de los mismos.
 */
export const validateResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      msg: "Errores de validación",
      errors: errors.array(),
    });
  }
  next();
};