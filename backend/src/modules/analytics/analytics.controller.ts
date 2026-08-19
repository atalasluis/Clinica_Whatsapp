import { Request, Response } from "express";
import { analyticsService } from "./analytics.service";

export const analyticsController = {
  async getOverview(req: Request, res: Response) {
    const data =
      await analyticsService.getOverview();

    res.status(200).json({
      success: true,
      data,
    });
  },

  async getLeadsByStatus(
    req: Request,
    res: Response
  ) {
    const data =
      await analyticsService.getLeadsByStatus();

    res.status(200).json({
      success: true,
      data,
    });
  },

  async getAppointmentsByStatus(
    req: Request,
    res: Response
  ) {
    const data =
      await analyticsService.getAppointmentsByStatus();

    res.status(200).json({
      success: true,
      data,
    });
  },

  async getPopularSpecialties(
    req: Request,
    res: Response
  ) {
    const data =
      await analyticsService.getPopularSpecialties();

    res.status(200).json({
      success: true,
      data,
    });
  },
};