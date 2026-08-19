import { Request, Response, NextFunction } from "express";
import * as messageService from "./message.service";

type IdParams = { id: string };
type ConversationParams = { conversationId: string };

export async function getById(
  req: Request<IdParams>,
  res: Response,
  next: NextFunction
) {
  try {
    const item = await messageService.findById(req.params.id);
    if (!item)
      return res
        .status(404)
        .json({ success: false, message: "Mensaje no encontrado" });
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

export async function getByConversation(
  req: Request<ConversationParams>,
  res: Response,
  next: NextFunction
) {
  try {
    const data = await messageService.findByConversation(
      req.params.conversationId
    );
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const item = await messageService.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}
