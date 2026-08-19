import { Request, Response, NextFunction } from "express";
import * as scheduleService from "./schedule.service";

type IdParams = { id: string };
type ProfessionalParams = { professionalId: string };

export async function list(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await scheduleService.findAll();
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
    const item = await scheduleService.findById(req.params.id);
    if (!item)
      return res
        .status(404)
        .json({ success: false, message: "Horario no encontrado" });
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

export async function getByProfessional(
  req: Request<ProfessionalParams>,
  res: Response,
  next: NextFunction
) {
  try {
    const data = await scheduleService.findByProfessional(
      req.params.professionalId
    );
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const item = await scheduleService.create(req.body);
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
    const item = await scheduleService.update(req.params.id, req.body);
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
    await scheduleService.remove(req.params.id);
    res.json({ success: true, message: "Horario eliminado" });
  } catch (err) {
    next(err);
  }
}
