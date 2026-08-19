import { Request, Response, NextFunction } from "express";
import * as surveyService from "./survey.service";

export async function submitSurvey(req: Request, res: Response, next: NextFunction) {
  try {
    const { appointmentId, clientId, rating, comment } = req.body;
    if (!appointmentId || !clientId || !rating) {
      return res.status(400).json({ success: false, message: "appointmentId, clientId y rating son requeridos" });
    }
    const data = await surveyService.submitSurvey({ appointmentId, clientId, rating, comment });
    res.status(201).json({ success: true, data });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
}

export async function getSurveyStats(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await surveyService.getSurveyStats();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}
