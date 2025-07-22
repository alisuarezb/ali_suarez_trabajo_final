// services
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { 
  getAllUsers, 
  getUserByEmail, 
  getUserById,
  saveUser, 
  emailExists 
} from "../models/user.model.js";

// Obtener todos los usuarios
const getAll = async () => {
  try {
    const users = await getAllUsers();
    // Remover contraseñas de la respuesta
    return users.map(user => {
      const { contraseña, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  } catch (error) {
    throw new Error(`Error en el servicio al obtener usuarios: ${error.message}`);
  }
};

// Obtener usuario por ID
const getById = async (id) => {
  try {
    const user = await getUserById(id);
    if (!user) return null;
    
    // Remover contraseña de la respuesta
    const { contraseña, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    throw new Error(`Error en el servicio al obtener usuario por ID: ${error.message}`);
  }
};

// Crear un nuevo usuario
const createUser = async (userData) => {
  try {
    const { nombre, email, contraseña } = userData;
    
    // Verificar si el email ya existe
    const exists = await emailExists(email);
    if (exists) {
      throw new Error('El email ya está registrado');
    }
    
    // Encriptar contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(contraseña, saltRounds);
    
    // Crear objeto usuario
    const newUser = {
      nombre: nombre.trim(),
      email: email.toLowerCase().trim(),
      contraseña: hashedPassword,
      rol: 'usuario', // rol por defecto
      activo: true,
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString()
    };
    
    return await saveUser(newUser);
  } catch (error) {
    throw new Error(`Error en el servicio al crear usuario: ${error.message}`);
  }
};

// Autenticar usuario (login)
const authenticateUser = async (email, contraseña) => {
  try {
    // Buscar usuario por email
    const user = await getUserByEmail(email.toLowerCase().trim());
    if (!user) {
      throw new Error('Credenciales inválidas');
    }
    
    // Verificar si el usuario está activo
    if (!user.activo) {
      throw new Error('Usuario desactivado');
    }
    
    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(contraseña, user.contraseña);
    if (!isValidPassword) {
      throw new Error('Credenciales inválidas');
    }
    
    // Generar JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        rol: user.rol 
      },
      process.env.JWT_SECRET,
      { 
        expiresIn: process.env.JWT_EXPIRES_IN || '24h' 
      }
    );
    
    // Retornar datos del usuario sin contraseña y el token
    const { contraseña: _, ...userWithoutPassword } = user;
    
    return {
      user: userWithoutPassword,
      token,
      expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    };
  } catch (error) {
    throw new Error(`Error en la autenticación: ${error.message}`);
  }
};

// Verificar token JWT
const verifyToken = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verificar que el usuario aún existe y está activo
    const user = await getUserById(decoded.id);
    if (!user || !user.activo) {
      throw new Error('Token inválido');
    }
    
    return decoded;
  } catch (error) {
    throw new Error(`Token inválido: ${error.message}`);
  }
};

export default { 
  getAll, 
  getById, 
  createUser, 
  authenticateUser,
  verifyToken 
};