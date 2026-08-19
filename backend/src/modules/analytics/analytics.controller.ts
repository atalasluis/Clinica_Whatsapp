import { Request, Response, NextFunction } from "express";
import * as analyticsService from "./analytics.service";

export async function overview(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await analyticsService.overview();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function leadsByStatus(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await analyticsService.leadsByStatus();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function appointmentsByStatus(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await analyticsService.appointmentsByStatus();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function topSpecialties(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await analyticsService.topSpecialties();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function totalMessagesReceived(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await analyticsService.totalMessagesReceived();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function messagesAutoAttended(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await analyticsService.messagesAutoAttended();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function conversationsPending(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await analyticsService.conversationsPending();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function avgResponseTime(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await analyticsService.avgResponseTime();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function messagesPerDay(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await analyticsService.messagesPerDay();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function leadsBySource(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await analyticsService.leadsBySource();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function appointmentConversionRate(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await analyticsService.appointmentConversionRate();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function escalatedConversations(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await analyticsService.escalatedConversations();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function performanceBySpecialty(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await analyticsService.performanceBySpecialty();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function appointmentsPerDay(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await analyticsService.appointmentsPerDay();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function todaySummary(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await analyticsService.todaySummary();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}
