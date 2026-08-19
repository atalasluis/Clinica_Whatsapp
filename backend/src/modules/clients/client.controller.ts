import { Request, Response, NextFunction } from "express";
import * as clientService from "./client.service";

type IdParams = { id: string };
type PhoneParams = { phone: string };

export async function list(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await clientService.findAll();
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
    const item = await clientService.findById(req.params.id);
    if (!item)
      return res
        .status(404)
        .json({ success: false, message: "Cliente no encontrado" });
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

export async function getByPhone(
  req: Request<PhoneParams>,
  res: Response,
  next: NextFunction
) {
  try {
    const item = await clientService.findByPhone(req.params.phone);
    if (!item)
      return res
        .status(404)
        .json({ success: false, message: "Cliente no encontrado" });
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const item = await clientService.create(req.body);
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
    const item = await clientService.update(req.params.id, req.body);
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}
