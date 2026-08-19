import { Request, Response, NextFunction } from "express";
import * as kbService from "./kb.service";

export async function getFullKnowledgeBase(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = await kbService.getFullKnowledgeBase();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getSpecialties(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = await kbService.getSpecialties();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getServices(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = await kbService.getServices();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getProfessionals(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = await kbService.getProfessionals();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getFaqs(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = kbService.getFaqs();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}
