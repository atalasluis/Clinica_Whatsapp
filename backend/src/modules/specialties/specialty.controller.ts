import { Request, Response } from "express";
import { specialtyService } from "./specialty.service";

type IdParams = {
  id: string;
};

export const specialtyController = {
  async getAll(req: Request, res: Response) {
    const specialties = await specialtyService.getAll();

    res.status(200).json({
      success: true,
      data: specialties,
    });
  },

  async getById(req: Request<IdParams>, res: Response) {
    const { id } = req.params;

    const specialty = await specialtyService.getById(id);

    if (!specialty) {
      res.status(404).json({
        success: false,
        error: {
          message: "Especialidad no encontrada",
        },
      });

      return;
    }

    res.status(200).json({
      success: true,
      data: specialty,
    });
  },

  async create(req: Request, res: Response) {
    const { name, description, active } = req.body;

    if (!name) {
      res.status(400).json({
        success: false,
        error: {
          message: "El nombre de la especialidad es obligatorio",
        },
      });

      return;
    }

    const specialty = await specialtyService.create({
      name,
      description,
      active,
    });

    res.status(201).json({
      success: true,
      data: specialty,
    });
  },

  async update(req: Request<IdParams>, res: Response) {
    const { id } = req.params;

    const existing = await specialtyService.getById(id);

    if (!existing) {
      res.status(404).json({
        success: false,
        error: {
          message: "Especialidad no encontrada",
        },
      });

      return;
    }

    const specialty = await specialtyService.update(id, req.body);

    res.status(200).json({
      success: true,
      data: specialty,
    });
  },

  async deactivate(req: Request<IdParams>, res: Response) {
    const { id } = req.params;

    const existing = await specialtyService.getById(id);

    if (!existing) {
      res.status(404).json({
        success: false,
        error: {
          message: "Especialidad no encontrada",
        },
      });

      return;
    }

    const specialty = await specialtyService.deactivate(id);

    res.status(200).json({
      success: true,
      data: specialty,
    });
  },
};