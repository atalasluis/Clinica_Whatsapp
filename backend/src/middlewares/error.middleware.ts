import {
  Request,
  Response,
  NextFunction,
} from "express";

interface AppError extends Error {
  statusCode?: number;
}

export function errorMiddleware(
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const statusCode = error.statusCode ?? 500;

  console.error({
    message: error.message,
    method: req.method,
    path: req.originalUrl,
    stack: error.stack,
  });

  res.status(statusCode).json({
    success: false,
    error: {
      message:
        statusCode === 500
          ? "Error interno del servidor"
          : error.message,
    },
  });
}