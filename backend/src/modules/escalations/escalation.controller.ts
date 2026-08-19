import { Request, Response, NextFunction } from "express";
import * as escalationService from "./escalation.service";

export async function list(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await escalationService.findAll();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function escalate(req: Request, res: Response, next: NextFunction) {
  try {
    const { conversationId, notes } = req.body;
    const data = await escalationService.escalate(conversationId, notes);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function resolve(req: Request, res: Response, next: NextFunction) {
  try {
    const { conversationId } = req.body;
    const data = await escalationService.resolve(conversationId);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function stats(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await escalationService.stats();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}
