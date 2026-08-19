import { Request, Response, NextFunction } from "express";
import * as appointmentService from "./appointment.service";

type IdParams = { id: string };

export async function list(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await appointmentService.findAll();
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
    const item = await appointmentService.findById(req.params.id);
    if (!item)
      return res
        .status(404)
        .json({ success: false, message: "Cita no encontrada" });
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const item = await appointmentService.create(req.body);
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
    const item = await appointmentService.update(req.params.id, req.body);
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

export async function cancel(
  req: Request<IdParams>,
  res: Response,
  next: NextFunction
) {
  try {
    const item = await appointmentService.cancel(req.params.id);
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}
