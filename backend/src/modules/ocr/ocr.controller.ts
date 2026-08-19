import { Request, Response, NextFunction } from "express";
import * as ocrService from "./ocr.service";

export async function processImage(req: Request, res: Response, next: NextFunction) {
  try {
    const { imageUrl, metadata } = req.body;
    const data = await ocrService.processImage(imageUrl, metadata);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function processDocument(req: Request, res: Response, next: NextFunction) {
  try {
    const { imageUrl, documentType } = req.body;
    const data = await ocrService.processDocument(imageUrl, documentType);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}
