import { Request, Response, NextFunction } from "express";
import * as alertService from "./alert.service";

export async function getAlerts(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await alertService.getAlerts();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function alertCount(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await alertService.alertCount();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}
