import { UserModel } from "../models/user.model.js";
import { hashPassword, comparePassword } from "../helpers/bcrypt.helper.js";
import { generateToken } from "../helpers/jwt.helper.js";

/**
 * Registro de usuario con perfil embebido (Público)[cite: 4, 5]
 */
export const register = async (req, res) => {
  try {
    const { username, email, password, role, profile } = req.body;

    // Verificar si el usuario ya existe por email o username
    const existingUser = await UserModel.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({
        msg: "El nombre de usuario o el correo electrónico ya se encuentran registrados.",
      });
    }

    // Hashear la contraseña con bcrypt[cite: 1, 3, 5]
    const hashedPassword = await hashPassword(password);

    // Crear el nuevo usuario
    const newUser = await UserModel.create({
      username,
      email,
      password: hashedPassword,
      role: role || "user",
      profile,
    });

    // Ocultar la contraseña en la respuesta
    const userResponse = newUser.toObject();
    delete userResponse.password;

    return res.status(201).json({
      msg: "Usuario registrado exitosamente",
      data: userResponse,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error interno del servidor",
    });
  }
};

/**
 * Login de usuario con JWT enviado como cookie segura (Público)[cite: 2, 4, 5]
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar el usuario activo (que no esté eliminado lógicamente)
    const user = await UserModel.findOne({ email, deletedAt: null });
    if (!user) {
      return res.status(400).json({
        msg: "Credenciales inválidas",
      });
    }

    // Comparar la contraseña ingresada con el hash de la BD
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        msg: "Credenciales inválidas",
      });
    }

    // Generar el token JWT con el ID y rol del usuario
    const token = generateToken({ id: user._id, role: user.role });

    // Configurar la cookie segura con httpOnly[cite: 2, 5]
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true en producción (HTTPS)
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 día
    });

    return res.status(200).json({
      msg: "Inicio de sesión exitoso",
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error interno del servidor",
    });
  }
};

/**
 * Obtener el perfil del usuario autenticado (Privado)[cite: 4, 5]
 */
export const profile = async (req, res) => {
  try {
    // req.user.id viene del authMiddleware
    const userId = req.user.id;

    const user = await UserModel.findOne({ _id: userId, deletedAt: null })
      .select("-password")
      .populate("events"); // Virtual populate de eventos organizados[cite: 3, 5]

    if (!user) {
      return res.status(404).json({
        msg: "Usuario no encontrado",
      });
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

/**
 * Actualizar el perfil embebido del usuario autenticado (Privado)[cite: 4, 5]
 */
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, profile } = req.body;

    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: userId, deletedAt: null },
      { username, profile },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        msg: "Usuario no encontrado",
      });
    }

    return res.status(200).json({
      msg: "Perfil actualizado correctamente",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error interno del servidor",
    });
  }
};

/**
 * Logout limpiando la cookie de autenticación (Privado)[cite: 4, 5]
 */
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(200).json({
      msg: "Sesión cerrada exitosamente",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error interno del servidor",
    });
  }
};