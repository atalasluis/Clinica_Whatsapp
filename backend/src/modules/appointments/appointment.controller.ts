import { Request, Response } from "express";
import { appointmentService } from "./appointment.service";

import {
  AppointmentSource,
  AppointmentStatus,
} from "../../generated/prisma/enums";

type IdParams = {
  id: string;
};

const validStatuses = Object.values(
  AppointmentStatus
);

const validSources = Object.values(
  AppointmentSource
);

export const appointmentController = {
  async getAll(req: Request, res: Response) {
    const appointments =
      await appointmentService.getAll();

    res.status(200).json({
      success: true,
      data: appointments,
    });
  },

  async getById(req: Request<IdParams>, res: Response) {
    const { id } = req.params;

    const appointment =
      await appointmentService.getById(id);

    if (!appointment) {
      res.status(404).json({
        success: false,
        error: {
          message: "Cita no encontrada",
        },
      });

      return;
    }

    res.status(200).json({
      success: true,
      data: appointment,
    });
  },

  async create(req: Request, res: Response) {
    const {
      clientId,
      professionalId,
      specialtyId,
      serviceId,
      scheduledAt,
      status,
      source,
      notes,
    } = req.body;

    if (!clientId || !scheduledAt) {
      res.status(400).json({
        success: false,
        error: {
          message:
            "clientId y scheduledAt son obligatorios",
        },
      });

      return;
    }

    const date = new Date(scheduledAt);

    if (Number.isNaN(date.getTime())) {
      res.status(400).json({
        success: false,
        error: {
          message: "scheduledAt no es una fecha válida",
        },
      });

      return;
    }

    if (
      status &&
      !validStatuses.includes(status)
    ) {
      res.status(400).json({
        success: false,
        error: {
          message: "Estado de cita inválido",
        },
      });

      return;
    }

    if (
      source &&
      !validSources.includes(source)
    ) {
      res.status(400).json({
        success: false,
        error: {
          message: "Origen de cita inválido",
        },
      });

      return;
    }

    const appointment =
      await appointmentService.create({
        clientId,
        professionalId,
        specialtyId,
        serviceId,
        scheduledAt: date,
        status,
        source,
        notes,
      });

    res.status(201).json({
      success: true,
      data: appointment,
    });
  },

  async update(req: Request<IdParams>, res: Response) {
    const { id } = req.params;

    const existing =
      await appointmentService.getById(id);

    if (!existing) {
      res.status(404).json({
        success: false,
        error: {
          message: "Cita no encontrada",
        },
      });

      return;
    }

    const data = {
      ...req.body,
    };

    if (data.scheduledAt) {
      const date = new Date(data.scheduledAt);

      if (Number.isNaN(date.getTime())) {
        res.status(400).json({
          success: false,
          error: {
            message:
              "scheduledAt no es una fecha válida",
          },
        });

        return;
      }

      data.scheduledAt = date;
    }

    const appointment =
      await appointmentService.update(id, data);

    res.status(200).json({
      success: true,
      data: appointment,
    });
  },

  async cancel(req: Request<IdParams>, res: Response) {
    const { id } = req.params;

    const existing =
      await appointmentService.getById(id);

    if (!existing) {
      res.status(404).json({
        success: false,
        error: {
          message: "Cita no encontrada",
        },
      });

      return;
    }

    const appointment =
      await appointmentService.cancel(id);

    res.status(200).json({
      success: true,
      data: appointment,
    });
  },
};