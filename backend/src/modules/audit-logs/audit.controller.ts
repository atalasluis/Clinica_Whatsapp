import { Request, Response, NextFunction } from "express";
import * as auditService from "./audit.service";

export async function getRecentActivity(req: Request, res: Response, next: NextFunction) {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const data = await auditService.getRecentActivity(limit);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function logEntry(req: Request, res: Response, next: NextFunction) {
  try {
    const { action, entityType, entityId, userId, details } = req.body;
    const data = await auditService.log(action, entityType, entityId, userId, details);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}
