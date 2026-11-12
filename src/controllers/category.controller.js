import { CategoryModel } from "../models/category.model.js";
import { EventModel } from "../models/event.model.js";

export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    const newCategory = await CategoryModel.create({
      name,
      description,
    });

    return res.status(201).json({
      msg: "Categoría creada correctamente",
      data: newCategory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error interno del servidor",
    });
  }
};

export const getAllCategory = async (req, res) => {
  try {
    const categories = await CategoryModel.find();

    return res.status(200).json({
      data: categories,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error interno del servidor",
    });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    // Obtener categoría con el virtual populate de events[cite: 5]
    const category = await CategoryModel.findById(id).populate("events");

    if (!category) {
      return res.status(404).json({ msg: "Categoría no encontrada" });
    }

    return res.status(200).json({
      data: category,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error interno del servidor",
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      id,
      { name, description },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ msg: "Categoría no encontrada" });
    }

    return res.status(200).json({
      msg: "Categoría actualizada correctamente",
      data: updatedCategory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error interno del servidor",
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await CategoryModel.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({ msg: "Categoría no encontrada" });
    }

    // Eliminación en cascada: quitar la categoría de todos los eventos que la referencian[cite: 4, 5]
    await EventModel.updateMany(
      { categories: id },
      { $pull: { categories: id } }
    );

    return res.status(200).json({
      msg: "Categoría eliminada y removida de los eventos asociados con éxito",
      data: category,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error interno del servidor",
    });
  }
};