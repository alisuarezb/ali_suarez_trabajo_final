// controller
import userService from "../services/user.service.js";

// Obtener todos los usuarios
const getUsers = async (req, res) => {
  try {
    const users = await userService.getAll();
    
    if (users.length === 0) {
      return res.status(200).json({ 
        success: true,
        message: "No hay usuarios disponibles", 
        data: [],
        count: 0
      });
    }

    res.status(200).json({ 
      success: true,
      message: "Lista de usuarios obtenida exitosamente", 
      data: users,
      count: users.length
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Error interno del servidor al obtener usuarios", 
      error: error.message 
    });
  }
};

// Obtener un usuario por ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID del usuario es requerido"
      });
    }

    const user = await userService.getById(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado"
      });
    }

    res.status(200).json({ 
      success: true,
      message: "Usuario encontrado", 
      data: user 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Error interno del servidor al obtener el usuario", 
      error: error.message 
    });
  }
};

// Crear un nuevo usuario
const createUser = async (req, res) => {
  try {
    const { nombre, email, contraseña } = req.body;
    
    // Validar campos requeridos
    if (!nombre || !email || !contraseña) {
      return res.status(400).json({
        success: false,
        message: "Los campos 'nombre', 'email' y 'contraseña' son requeridos"
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Formato de email inválido"
      });
    }

    // Validar longitud de contraseña
    if (contraseña.length < 6) {
      return res.status(400).json({
        success: false,
        message: "La contraseña debe tener al menos 6 caracteres"
      });
    }

    const newUser = await userService.createUser({ nombre, email, contraseña });
    
    res.status(201).json({ 
      success: true,
      message: "Usuario creado exitosamente", 
      data: newUser 
    });
  } catch (error) {
    // Manejar error de email duplicado
    if (error.message.includes('ya está registrado')) {
      return res.status(409).json({
        success: false,
        message: error.message
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: "Error interno del servidor al crear el usuario", 
      error: error.message 
    });
  }
};

// Login de usuario
const loginUser = async (req, res) => {
  try {
    const { email, contraseña } = req.body;
    
    // Validar campos requeridos
    if (!email || !contraseña) {
      return res.status(400).json({
        success: false,
        message: "Email y contraseña son requeridos"
      });
    }

    const authResult = await userService.authenticateUser(email, contraseña);
    
    res.status(200).json({ 
      success: true,
      message: "Autenticación exitosa", 
      data: {
        user: authResult.user,
        token: authResult.token,
        expiresIn: authResult.expiresIn
      }
    });
  } catch (error) {
    // Manejar errores de autenticación
    if (error.message.includes('Credenciales inválidas') || 
        error.message.includes('Usuario desactivado')) {
      return res.status(401).json({
        success: false,
        message: error.message
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: "Error interno del servidor en la autenticación", 
      error: error.message 
    });
  }
};

// Obtener perfil del usuario autenticado
const getProfile = async (req, res) => {
  try {
    // El middleware de autenticación debe agregar req.user
    const user = await userService.getById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado"
      });
    }

    res.status(200).json({ 
      success: true,
      message: "Perfil obtenido exitosamente", 
      data: user 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Error interno del servidor al obtener el perfil", 
      error: error.message 
    });
  }
};

export default { 
  getUsers, 
  getUserById, 
  createUser, 
  loginUser,
  getProfile 
};