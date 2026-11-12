import { verifyToken } from "../helpers/jwt.helper.js";

/**
 * Middleware para autenticar usuarios mediante JWT almacenado en cookies.
 * Protege las rutas privadas verificando que el token sea válido.
 */
export const authMiddleware = (req, res, next) => {
  try {
    // 1. Extraer el token de las cookies (requiere cookie-parser configurado en app.js)
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        msg: "No autorizado. Falta el token de autenticación.", // 401 Unauthorized[cite: 2]
      });
    }

    // 2. Verificar la validez del token utilizando el helper
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({
        msg: "No autorizado. Token inválido o expirado.", // 401 Unauthorized[cite: 2]
      });
    }

    // 3. Adjuntar la información del usuario decodificada al objeto request (req.user)[cite: 5]
    req.user = decoded;

    // 4. Continuar con la ejecución de la siguiente función o controlador
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error interno del servidor", // 500 Internal Server Error[cite: 2]
    });
  }
};