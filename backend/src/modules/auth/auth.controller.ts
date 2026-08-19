import { Request, Response, NextFunction } from "express";
import * as authService from "./auth.service";

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email y password son requeridos" });
    }
    const data = await authService.login(email, password);
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(401).json({ success: false, message: err.message });
  }
}

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Name, email y password son requeridos" });
    }
    const data = await authService.register({ name, email, password, role });
    res.status(201).json({ success: true, data });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
}

export async function me(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user.id;
    const data = await authService.getProfile(userId);
    res.json({ success: true, data });
  } catch (err: any) {
    next(err);
  }
}

export async function listUsers(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await authService.findAll();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}
