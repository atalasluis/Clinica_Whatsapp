import { Request, Response } from "express";
import { scheduleService } from "./schedule.service";
import {
  DayOfWeek,
  ScheduleType,
} from "../../generated/prisma/enums";

type IdParams = {
  id: string;
};

type ProfessionalParams = {
  professionalId: string;
};

const validScheduleTypes = Object.values(ScheduleType);

const validDays = Object.values(DayOfWeek);

export const scheduleController = {
  async getAll(req: Request, res: Response) {
    const schedules = await scheduleService.getAll();

    res.status(200).json({
      success: true,
      data: schedules,
    });
  },

  async getById(req: Request<IdParams>, res: Response) {
    const { id } = req.params;

    const schedule = await scheduleService.getById(id);

    if (!schedule) {
      res.status(404).json({
        success: false,
        error: {
          message: "Horario no encontrado",
        },
      });

      return;
    }

    res.status(200).json({
      success: true,
      data: schedule,
    });
  },

  async getByProfessional(
    req: Request<ProfessionalParams>,
    res: Response
  ) {
    const { professionalId } = req.params;

    const schedules =
      await scheduleService.getByProfessional(
        professionalId
      );

    res.status(200).json({
      success: true,
      data: schedules,
    });
  },

  async create(req: Request, res: Response) {
    const {
      professionalId,
      specialtyId,
      serviceId,
      type,
      dayOfWeek,
      startTime,
      endTime,
      notes,
    } = req.body;

    if (!professionalId || !type) {
      res.status(400).json({
        success: false,
        error: {
          message:
            "professionalId y type son obligatorios",
        },
      });

      return;
    }

    if (!validScheduleTypes.includes(type)) {
      res.status(400).json({
        success: false,
        error: {
          message: "Tipo de horario inválido",
        },
      });

      return;
    }

    if (
      dayOfWeek &&
      !validDays.includes(dayOfWeek)
    ) {
      res.status(400).json({
        success: false,
        error: {
          message: "Día de la semana inválido",
        },
      });

      return;
    }

    if (
      type === ScheduleType.FIXED &&
      (!dayOfWeek || !startTime || !endTime)
    ) {
      res.status(400).json({
        success: false,
        error: {
          message:
            "Los horarios FIXED necesitan dayOfWeek, startTime y endTime",
        },
      });

      return;
    }

    const schedule =
      await scheduleService.create({
        professionalId,
        specialtyId,
        serviceId,
        type,
        dayOfWeek,
        startTime,
        endTime,
        notes,
      });

    res.status(201).json({
      success: true,
      data: schedule,
    });
  },

  async update(req: Request<IdParams>, res: Response) {
    const { id } = req.params;

    const existing = await scheduleService.getById(id);

    if (!existing) {
      res.status(404).json({
        success: false,
        error: {
          message: "Horario no encontrado",
        },
      });

      return;
    }

    const schedule =
      await scheduleService.update(
        id,
        req.body
      );

    res.status(200).json({
      success: true,
      data: schedule,
    });
  },

  async remove(req: Request<IdParams>, res: Response) {
    const { id } = req.params;

    const existing = await scheduleService.getById(id);

    if (!existing) {
      res.status(404).json({
        success: false,
        error: {
          message: "Horario no encontrado",
        },
      });

      return;
    }

    await scheduleService.remove(id);

    res.status(200).json({
      success: true,
      message: "Horario eliminado correctamente",
    });
  },
};