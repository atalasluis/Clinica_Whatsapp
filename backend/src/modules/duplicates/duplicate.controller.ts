import { Request, Response, NextFunction } from "express";
import * as duplicateService from "./duplicate.service";

export async function findDuplicates(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await duplicateService.findDuplicateClients();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function merge(req: Request, res: Response, next: NextFunction) {
  try {
    const { keepId, removeId } = req.body;
    const data = await duplicateService.mergeClients(keepId, removeId);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}
