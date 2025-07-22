// Middleware para manejo centralizado de errores

// Clase personalizada para errores de la aplicación
export class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    
    Error.captureStackTrace(this, this.constructor);
  }
}

// Middleware para capturar errores async
export const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

// Middleware global de manejo de errores
export const globalErrorHandler = (error, req, res, next) => {
  let err = { ...error };
  err.message = error.message;

  // Log del error
  console.error('Error:', error);

  // Error de validación de Firebase
  if (error.code === 'permission-denied') {
    const message = 'No tienes permisos para realizar esta operación';
    err = new AppError(message, 403);
  }

  // Error de documento no encontrado en Firebase
  if (error.code === 'not-found') {
    const message = 'Recurso no encontrado';
    err = new AppError(message, 404);
  }

  // Error de conexión a Firebase
  if (error.code === 'unavailable') {
    const message = 'Servicio temporalmente no disponible. Intenta más tarde';
    err = new AppError(message, 503);
  }

  // Error de validación de datos
  if (error.name === 'ValidationError') {
    const message = 'Datos de entrada inválidos';
    err = new AppError(message, 400);
  }

  // Error por defecto
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';

  res.status(statusCode).json({
    success: false,
    error: true,
    message,
    statusCode,
    ...(process.env.NODE_ENV === 'development' && { 
      stack: error.stack,
      details: error 
    })
  });
};

// Middleware para manejar rutas no encontradas
export const notFoundHandler = (req, res, next) => {
  const message = `La ruta ${req.originalUrl} no fue encontrada en este servidor`;
  const error = new AppError(message, 404);
  next(error);
};