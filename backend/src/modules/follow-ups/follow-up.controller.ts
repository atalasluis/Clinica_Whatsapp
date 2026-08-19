import { Request, Response, NextFunction } from "express";
import * as followUpService from "./follow-up.service";

export async function getLeadsNeedingFollowUp(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await followUpService.getLeadsNeedingFollowUp();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function markFollowedUp(req: Request, res: Response, next: NextFunction) {
  try {
    const { leadId, notes } = req.body;
    const data = await followUpService.markFollowedUp(leadId, notes);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function stats(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await followUpService.stats();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}
