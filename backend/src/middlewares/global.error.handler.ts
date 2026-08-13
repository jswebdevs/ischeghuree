import { ErrorRequestHandler } from 'express';

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong!';
  
  console.error('🔥 Global Error Handler:', {
    message: err.message,
    stack: err.stack,
    path: req.originalUrl
  });
  
  res.status(statusCode).json({
    success: false,
    message,
    errorMessages: [
      {
        path: req.originalUrl,
        message,
      },
    ],
    // Only show stack trace in development mode for debugging
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

export default globalErrorHandler; // Export as default