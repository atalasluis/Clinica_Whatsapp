import { Request, Response, NextFunction } from "express";
import * as leadService from "./lead.service";

type IdParams = { id: string };

export async function list(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await leadService.findAll();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getById(
  req: Request<IdParams>,
  res: Response,
  next: NextFunction
) {
  try {
    const item = await leadService.findById(req.params.id);
    if (!item)
      return res
        .status(404)
        .json({ success: false, message: "Lead no encontrado" });
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const item = await leadService.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

export async function update(
  req: Request<IdParams>,
  res: Response,
  next: NextFunction
) {
  try {
    const item = await leadService.update(req.params.id, req.body);
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}
