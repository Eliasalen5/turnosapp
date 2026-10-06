import mongoose from 'mongoose';

export function notFound(req, res) {
  res.status(404).json({
    status: 'error',
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
  });
}

export function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Error interno del servidor';

  if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = Object.values(err.errors).map((e) => e.message).join(' | ');
  } else if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = `Valor inválido en el campo ${err.path}`;
  } else if (err.code === 11000) {
    statusCode = 409;
    message = 'Registro duplicado';
  }

  if (statusCode === 500) {
    console.error(err);
  }

  res.status(statusCode).json({
    status: 'error',
    message,
  });
}
