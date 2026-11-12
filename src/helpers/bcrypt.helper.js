import bcrypt from "bcrypt";

/**
 * Hashea una contraseña en texto plano utilizando un factor de costo (salt rounds).
 * @param {String} password - Contraseña en texto plano proporcionada por el usuario.
 * @returns {Promise<String>} - Retorna la contraseña hasheada.
 */
export const hashPassword = async (password) => {
  const saltRounds = 10; // Número de rondas de salting recomendadas
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

/**
 * Compara una contraseña en texto plano con una contraseña hasheada de la base de datos.
 * @param {String} password - Contraseña ingresada en el login.
 * @param {String} hashedPassword - Contraseña hasheada almacenada en el modelo User.
 * @returns {Promise<Boolean>} - Retorna true si coinciden, o false si son incorrectas.
 */
export const comparePassword = async (password, hashedPassword) => {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
};