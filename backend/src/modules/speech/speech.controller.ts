import { Request, Response, NextFunction } from "express";
import * as speechService from "./speech.service";

export async function transcribeAudio(req: Request, res: Response, next: NextFunction) {
  try {
    const { audioUrl, metadata } = req.body;
    const data = await speechService.transcribeAudio(audioUrl, metadata);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}
