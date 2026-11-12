import { EventModel } from "../models/event.model.js";

/**
 * Middleware para verificar si el usuario autenticado es administrador
 * o es el organizador (dueño) del evento que desea modificar/eliminar.
 * Nota: Debe usarse después de authMiddleware.
 */
export const ownerOrAdminMiddleware = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;
    const { id: eventId } = req.params;

    if (!userId) {
      return res.status(401).json({ 
        msg: "No autorizado, falta autenticación" // 401 Unauthorized[cite: 2]
      });
    }

    // 1. Si el usuario es 'admin', se le permite continuar directamente
    if (userRole === "admin") {
      return next();
    }

    // 2. Buscar el evento en la base de datos para verificar quién es su organizador
    const event = await EventModel.findById(eventId);

    if (!event) {
      return res.status(404).json({ 
        msg: "Evento no encontrado" // 404 Not Found[cite: 2]
      });
    }

    // 3. Comprobar si el ID del usuario coincide con el organizador del evento
    // (Se usa .toString() porque el ObjectId de Mongoose es un objeto)
    if (event.organizer.toString() !== userId) {
      return res.status(403).json({ 
        msg: "Acceso denegado. Solo el organizador o un administrador pueden realizar esta acción" // 403 Forbidden[cite: 2]
      });
    }

    // Si pasó las validaciones, continúa con el controlador
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ 
      msg: "Error interno del servidor" // 500 Internal Server Error[cite: 2]
    });
  }
};