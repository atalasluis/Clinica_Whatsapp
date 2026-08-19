import { Request, Response, NextFunction } from "express";
import * as reportService from "./report.service";

export async function dailyReport(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await reportService.dailyReport();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function weeklyReport(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await reportService.weeklyReport();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}
