import { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error(`[Error] ${err.message}`);
  console.error(err.stack);

  res.status(500).json({
    success: false,
    message: "Error interno del servidor",
    ...(process.env.NODE_ENV === "development" && { error: err.message }),
  });
}
