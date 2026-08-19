import { Request, Response, NextFunction } from "express";
import * as botpressService from "./botpress.service";

export async function webhook(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await botpressService.handleWebhook(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}
