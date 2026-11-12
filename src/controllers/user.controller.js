import { UserModel } from "../models/user.model.js";
import { EventModel } from "../models/event.model.js";
import bcrypt from "bcrypt";

export const createUser = async (req, res) => {
  try {
    const { username, email, password, role, profile } = req.body;

    // Hasheo de contraseña con bcrypt (Requerido)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await UserModel.create({
      username,
      email,
      password: hashedPassword,
      role,
      profile,
    });

    return res.status(201).json({
      msg: "Usuario creado correctamente",
      data: newUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error interno del servidor",
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    // Listar solo usuarios activos (deletedAt: null) con virtual populate de events[cite: 3, 5]
    const users = await UserModel.find({ deletedAt: null }).populate("events");

    return res.status(200).json({
      data: users,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error interno del servidor",
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await UserModel.findOne({ _id: id, deletedAt: null }).populate("events");

    if (!user) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    return res.status(200).json({
      data: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error interno del servidor",
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, role, profile } = req.body;

    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { username, email, role, profile },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    return res.status(200).json({
      msg: "Usuario actualizado correctamente",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error interno del servidor",
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Eliminación lógica (Soft Delete) actualizando deletedAt[cite: 4, 5]
    const user = await UserModel.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { deletedAt: new Date() },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ msg: "Usuario no encontrado o ya eliminado" });
    }

    // 2. Eliminación en cascada de los eventos que organizó[cite: 4, 5]
    await EventModel.deleteMany({ organizer: id });

    return res.status(200).json({
      msg: "Usuario eliminado lógicamente y sus eventos eliminados en cascada",
      data: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error interno del servidor",
    });
  }
};