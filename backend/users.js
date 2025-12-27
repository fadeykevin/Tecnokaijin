// users.js
const bcrypt = require('bcryptjs');

// ================= USUARIOS MOCK (SIMULADOS) =================
// En un proyecto real, esto estaría en una base de datos como PostgreSQL o MongoDB

// Contraseñas ya encriptadas con bcrypt
const users = [
  {
    id: 1,
    name: 'Administrador TecnoKaijin',
    email: 'admin@tecnokaijin.cl',
    password: bcrypt.hashSync('admin123', 10),
    role: 'admin',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 2,
    name: 'Cliente Demo',
    email: 'cliente@tecnokaijin.cl',
    password: bcrypt.hashSync('user123', 10),
    role: 'user',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  }
];

// Contador para IDs de nuevos usuarios
let nextUserId = 3;

// ================= FUNCIONES DE GESTIÓN DE USUARIOS =================

/**
 * Buscar usuario por email
 * @param {string} email - Email del usuario
 * @returns {object|undefined} Usuario encontrado o undefined
 */
const findUserByEmail = (email) => {
  return users.find(u => u.email.toLowerCase() === email.toLowerCase());
};

/**
 * Buscar usuario por ID
 * @param {number} id - ID del usuario
 * @returns {object|undefined} Usuario encontrado o undefined
 */
const findUserById = (id) => {
  return users.find(u => u.id === parseInt(id));
};

/**
 * Obtener todos los usuarios (sin contraseñas)
 * @returns {array} Array de usuarios sin campo password
 */
const getAllUsers = () => {
  return users.map(user => {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  });
};

/**
 * Crear nuevo usuario
 * @param {object} userData - Datos del nuevo usuario
 * @returns {object} Usuario creado (sin contraseña)
 */
const createUser = (userData) => {
  // Verificar si el email ya existe
  const existingUser = findUserByEmail(userData.email);
  if (existingUser) {
    throw new Error('El email ya está registrado');
  }

  // Validar datos requeridos
  if (!userData.name || !userData.email || !userData.password) {
    throw new Error('Faltan datos requeridos');
  }

  // Validar longitud de contraseña
  if (userData.password.length < 6) {
    throw new Error('La contraseña debe tener al menos 6 caracteres');
  }

  const newUser = {
    id: nextUserId++,
    name: userData.name.trim(),
    email: userData.email.toLowerCase().trim(),
    password: bcrypt.hashSync(userData.password, 10),
    role: userData.role || 'user',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  users.push(newUser);

  // Retornar usuario sin contraseña
  const { password, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

/**
 * Actualizar usuario
 * @param {number} id - ID del usuario
 * @param {object} updateData - Datos a actualizar
 * @returns {object} Usuario actualizado (sin contraseña)
 */
const updateUser = (id, updateData) => {
  const userIndex = users.findIndex(u => u.id === parseInt(id));
  
  if (userIndex === -1) {
    throw new Error('Usuario no encontrado');
  }

  // Si se está actualizando el email, verificar que no exista
  if (updateData.email) {
    const existingUser = findUserByEmail(updateData.email);
    if (existingUser && existingUser.id !== parseInt(id)) {
      throw new Error('El email ya está en uso');
    }
  }

  // Si se está actualizando la contraseña, encriptarla
  if (updateData.password) {
    if (updateData.password.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }
    updateData.password = bcrypt.hashSync(updateData.password, 10);
  }

  // Actualizar usuario
  users[userIndex] = {
    ...users[userIndex],
    ...updateData,
    id: parseInt(id), // Mantener el ID original
    updatedAt: new Date()
  };

  // Retornar usuario sin contraseña
  const { password, ...userWithoutPassword } = users[userIndex];
  return userWithoutPassword;
};

/**
 * Eliminar usuario
 * @param {number} id - ID del usuario a eliminar
 * @returns {boolean} true si se eliminó correctamente
 */
const deleteUser = (id) => {
  const userIndex = users.findIndex(u => u.id === parseInt(id));
  
  if (userIndex === -1) {
    throw new Error('Usuario no encontrado');
  }

  // No permitir eliminar al admin principal
  if (users[userIndex].role === 'admin' && users[userIndex].id === 1) {
    throw new Error('No se puede eliminar al administrador principal');
  }

  users.splice(userIndex, 1);
  return true;
};

/**
 * Verificar contraseña
 * @param {string} plainPassword - Contraseña en texto plano
 * @param {string} hashedPassword - Contraseña encriptada
 * @returns {boolean} true si la contraseña es correcta
 */
const verifyPassword = (plainPassword, hashedPassword) => {
  return bcrypt.compareSync(plainPassword, hashedPassword);
};

/**
 * Validar credenciales de usuario
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña en texto plano
 * @returns {object} Usuario sin contraseña si las credenciales son válidas
 */
const validateCredentials = (email, password) => {
  const user = findUserByEmail(email);
  
  if (!user) {
    throw new Error('Credenciales inválidas');
  }

  const isValidPassword = verifyPassword(password, user.password);
  
  if (!isValidPassword) {
    throw new Error('Credenciales inválidas');
  }

  // Retornar usuario sin contraseña
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

/**
 * Obtener estadísticas de usuarios
 * @returns {object} Objeto con estadísticas
 */
const getUserStats = () => {
  return {
    total: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    users: users.filter(u => u.role === 'user').length,
    newest: users[users.length - 1]?.email || 'N/A'
  };
};

// ================= EXPORTAR FUNCIONES =================

module.exports = {
  // Búsqueda
  findUserByEmail,
  findUserById,
  getAllUsers,
  
  // CRUD
  createUser,
  updateUser,
  deleteUser,
  
  // Autenticación
  verifyPassword,
  validateCredentials,
  
  // Estadísticas
  getUserStats,
  
  // Array de usuarios (para testing)
  users
};