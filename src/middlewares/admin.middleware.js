/**
 * Middleware para verificar si el usuario autenticado es administrador.
 * Nota: Debe usarse siempre después de authMiddleware.
 */
export const adminMiddleware = (req, res, next) => {
  try {
    // Verificamos que req.user exista (poblado por authMiddleware)
    if (!req.user) {
      return res.status(401).json({ 
        msg: "No autorizado, falta autenticación" // 401 Unauthorized[cite: 2]
      });
    }

    // Verificamos si el rol del usuario es 'admin'
    if (req.user.role !== "admin") {
      return res.status(403).json({ 
        msg: "Acceso denegado. Se requieren permisos de administrador" // 403 Forbidden[cite: 2]
      });
    }

    // Si es admin, permitimos continuar con la petición
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ 
      msg: "Error interno del servidor" 
    });
  }
};