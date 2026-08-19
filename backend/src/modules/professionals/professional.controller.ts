import { Request, Response } from "express";
import { professionalService } from "./professional.service";

type IdParams = {
  id: string;
};

export const professionalController = {
  async getAll(req: Request, res: Response) {
    const professionals =
      await professionalService.getAll();

    res.status(200).json({
      success: true,
      data: professionals,
    });
  },

  async getById(req: Request<IdParams>, res: Response) {
    const { id } = req.params;

    const professional =
      await professionalService.getById(id);

    if (!professional) {
      res.status(404).json({
        success: false,
        error: {
          message: "Profesional no encontrado",
        },
      });

      return;
    }

    res.status(200).json({
      success: true,
      data: professional,
    });
  },

  async create(req: Request, res: Response) {
    const {
      firstName,
      lastName,
      title,
      active,
      specialtyIds,
      serviceIds,
    } = req.body;

    if (!firstName) {
      res.status(400).json({
        success: false,
        error: {
          message:
            "El nombre del profesional es obligatorio",
        },
      });

      return;
    }

    const professional =
      await professionalService.create({
        firstName,
        lastName,
        title,
        active,
        specialtyIds,
        serviceIds,
      });

    res.status(201).json({
      success: true,
      data: professional,
    });
  },

  async update(req: Request<IdParams>, res: Response) {
    const { id } = req.params;

    const existing =
      await professionalService.getById(id);

    if (!existing) {
      res.status(404).json({
        success: false,
        error: {
          message: "Profesional no encontrado",
        },
      });

      return;
    }

    const professional =
      await professionalService.update(
        id,
        req.body
      );

    res.status(200).json({
      success: true,
      data: professional,
    });
  },

  async deactivate(
    req: Request<IdParams>,
    res: Response
  ) {
    const { id } = req.params;

    const existing =
      await professionalService.getById(id);

    if (!existing) {
      res.status(404).json({
        success: false,
        error: {
          message: "Profesional no encontrado",
        },
      });

      return;
    }

    const professional =
      await professionalService.deactivate(id);

    res.status(200).json({
      success: true,
      data: professional,
    });
  },
};