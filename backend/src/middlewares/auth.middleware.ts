import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../modules/auth/auth.service";

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Token de autenticación requerido" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const user = verifyToken(token);
    (req as any).user = user;
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Token inválido o expirado" });
  }
}

export function authorize(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ success: false, message: "No autenticado" });
    }
    if (roles.length > 0 && !roles.includes(user.role)) {
      return res.status(403).json({ success: false, message: "No tiene permisos para esta acción" });
    }
    next();
  };
}
