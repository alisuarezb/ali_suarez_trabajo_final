// Middleware de autenticación con JWT
import userService from "../services/user.service.js";

// Middleware para verificar token JWT
export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Token de autorización requerido",
        statusCode: 401
      });
    }

    const token = authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Formato de token inválido. Use: Bearer <token>",
        statusCode: 401
      });
    }

    // Verificar token
    const decoded = await userService.verifyToken(token);
    
    // Agregar información del usuario a la request
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token inválido o expirado",
      error: error.message,
      statusCode: 401
    });
  }
};

// Middleware para verificar roles específicos
export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Usuario no autenticado",
        statusCode: 401
      });
    }

    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({
        success: false,
        message: "No tienes permisos para realizar esta acción",
        statusCode: 403
      });
    }

    next();
  };
};

// Middleware para verificar que el usuario es admin
export const requireAdmin = requireRole(['admin']);

// Middleware para verificar que el usuario es admin o editor
export const requireAdminOrEditor = requireRole(['admin', 'editor']);

// Middleware de validación de datos de usuario
export const validateUserData = (req, res, next) => {
  const { nombre, email, contraseña } = req.body;
  
  if (!nombre || typeof nombre !== 'string' || nombre.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: "El nombre es requerido y debe ser una cadena válida",
      statusCode: 400
    });
  }

  if (!email || typeof email !== 'string' || email.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: "El email es requerido y debe ser una cadena válida",
      statusCode: 400
    });
  }

  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Formato de email inválido",
      statusCode: 400
    });
  }

  if (!contraseña || typeof contraseña !== 'string' || contraseña.length < 6) {
    return res.status(400).json({
      success: false,
      message: "La contraseña es requerida y debe tener al menos 6 caracteres",
      statusCode: 400
    });
  }

  next();
};

// Middleware de validación de datos de login
export const validateLoginData = (req, res, next) => {
  const { email, contraseña } = req.body;
  
  if (!email || typeof email !== 'string' || email.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: "El email es requerido",
      statusCode: 400
    });
  }

  if (!contraseña || typeof contraseña !== 'string' || contraseña.length === 0) {
    return res.status(400).json({
      success: false,
      message: "La contraseña es requerida",
      statusCode: 400
    });
  }

  next();
};