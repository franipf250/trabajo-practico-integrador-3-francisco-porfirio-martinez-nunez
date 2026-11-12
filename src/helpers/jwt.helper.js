import jwt from "jsonwebtoken";

/**
 * Genera un token JWT a partir de un payload (ej. id y rol del usuario).
 * @param {Object} payload - Datos que se incluirán en el token.
 * @returns {String} - Token JWT firmado.
 */
export const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d", // Tiempo de expiración definido en .env o por defecto 1 día
  });
};

/**
 * Verifica la validez de un token JWT.
 * @param {String} token - Token JWT recibido.
 * @returns {Object|null} - Payload decodificado si es válido, o null si es inválido/expirado.
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null; // Retorna null si el token expiró o no es válido
  }
};