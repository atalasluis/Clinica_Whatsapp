import { Request, Response, NextFunction } from "express";
import * as professionalService from "./professional.service";

type IdParams = { id: string };

export async function list(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await professionalService.findAll();
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
    const item = await professionalService.findById(req.params.id);
    if (!item)
      return res
        .status(404)
        .json({ success: false, message: "Profesional no encontrado" });
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const item = await professionalService.create(req.body);
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
    const item = await professionalService.update(req.params.id, req.body);
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

export async function remove(
  req: Request<IdParams>,
  res: Response,
  next: NextFunction
) {
  try {
    const item = await professionalService.deactivate(req.params.id);
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}
