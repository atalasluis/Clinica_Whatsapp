import { Request, Response, NextFunction } from "express";
import * as conversationService from "./conversation.service";

type IdParams = { id: string };
type ExternalParams = { externalId: string };

export async function list(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await conversationService.findAll();
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
    const item = await conversationService.findById(req.params.id);
    if (!item)
      return res
        .status(404)
        .json({ success: false, message: "Conversación no encontrada" });
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

export async function getByExternalId(
  req: Request<ExternalParams>,
  res: Response,
  next: NextFunction
) {
  try {
    const item = await conversationService.findByExternalId(
      req.params.externalId
    );
    if (!item)
      return res
        .status(404)
        .json({ success: false, message: "Conversación no encontrada" });
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const item = await conversationService.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

export async function close(
  req: Request<IdParams>,
  res: Response,
  next: NextFunction
) {
  try {
    const item = await conversationService.close(req.params.id);
    res.json({ success: true, data: item });
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
    const item = await conversationService.update(req.params.id, req.body);
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}
