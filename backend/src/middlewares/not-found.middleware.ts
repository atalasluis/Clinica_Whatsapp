import { Request, Response } from "express";

export function notFoundMiddleware(
  req: Request,
  res: Response
): void {
  res.status(404).json({
    success: false,
    error: {
      message: "Ruta no encontrada",
      method: req.method,
      path: req.originalUrl,
    },
  });
}