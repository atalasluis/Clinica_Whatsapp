import { Request, Response, NextFunction } from "express";
import * as analyticsService from "./analytics.service";

export async function overview(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await analyticsService.overview();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function leadsByStatus(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await analyticsService.leadsByStatus();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function appointmentsByStatus(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await analyticsService.appointmentsByStatus();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function topSpecialties(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await analyticsService.topSpecialties();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}
