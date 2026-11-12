import { EventModel } from "../models/event.model.js";

/**
 * Crear un evento con sus categorías; el organizador es el usuario autenticado (Usuario autenticado)[cite: 5]
 */
export const createEvent = async (req, res) => {
  try {
    const { title, description, startDate, endDate, capacity, price, status, location, categories } = req.body;
    
    // El id del organizador se obtiene del token decodificado (authMiddleware)
    const organizer = req.user.id;

    const newEvent = await EventModel.create({
      title,
      description,
      startDate,
      endDate,
      capacity,
      price,
      status,
      location,
      organizer,
      categories,
    });

    return res.status(201).json({
      msg: "Evento creado correctamente",
      data: newEvent,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error interno del servidor",
    });
  }
};

/**
 * Listar los eventos con populate de organizer y categories (Usuario autenticado)[cite: 5]
 */
export const getAllEvents = async (req, res) => {
  try {
    const events = await EventModel.find()
      .populate("organizer", "-password")
      .populate("categories");

    return res.status(200).json({
      data: events,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error interno del servidor",
    });
  }
};

/**
 * Listar los eventos del usuario logueado (Usuario autenticado)[cite: 5]
 */
export const getMyEvents = async (req, res) => {
  try {
    const organizerId = req.user.id;

    const events = await EventModel.find({ organizer: organizerId })
      .populate("organizer", "-password")
      .populate("categories");

    return res.status(200).json({
      data: events,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error interno del servidor",
    });
  }
};

/**
 * Obtener un evento con populate de organizer y categories (Usuario autenticado)[cite: 5]
 */
export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await EventModel.findById(id)
      .populate("organizer", "-password")
      .populate("categories");

    if (!event) {
      return res.status(404).json({
        msg: "Evento no encontrado",
      });
    }

    return res.status(200).json({
      data: event,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error interno del servidor",
    });
  }
};

/**
 * Actualizar un evento y sus categorías (Solo organizador o admin)[cite: 5]
 */
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, startDate, endDate, capacity, price, status, location, categories } = req.body;

    const updatedEvent = await EventModel.findByIdAndUpdate(
      id,
      {
        title,
        description,
        startDate,
        endDate,
        capacity,
        price,
        status,
        location,
        categories,
      },
      { new: true, runValidators: true }
    )
      .populate("organizer", "-password")
      .populate("categories");

    if (!updatedEvent) {
      return res.status(404).json({
        msg: "Evento no encontrado",
      });
    }

    return res.status(200).json({
      msg: "Evento actualizado correctamente",
      data: updatedEvent,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error interno del servidor",
    });
  }
};

/**
 * Eliminación física de un evento (Solo organizador o admin)[cite: 5]
 */
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedEvent = await EventModel.findByIdAndDelete(id);

    if (!deletedEvent) {
      return res.status(404).json({
        msg: "Evento no encontrado",
      });
    }

    return res.status(200).json({
      msg: "Evento eliminado correctamente",
      data: deletedEvent,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error interno del servidor",
    });
  }
};