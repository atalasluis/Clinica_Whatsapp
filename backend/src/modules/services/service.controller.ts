import { Request, Response } from "express";
import { serviceService } from "./service.service";
import { ServiceCategory } from "../../generated/prisma/enums";

type IdParams = {
  id: string;
};

const validCategories = Object.values(ServiceCategory);

export const serviceController = {
  async getAll(req: Request, res: Response) {
    const services = await serviceService.getAll();

    res.status(200).json({
      success: true,
      data: services,
    });
  },

  async getById(req: Request<IdParams>, res: Response) {
    const { id } = req.params;

    const service = await serviceService.getById(id);

    if (!service) {
      res.status(404).json({
        success: false,
        error: {
          message: "Servicio no encontrado",
        },
      });

      return;
    }

    res.status(200).json({
      success: true,
      data: service,
    });
  },

  async create(req: Request, res: Response) {
    const {
      name,
      description,
      category,
      price,
      currency,
      active,
    } = req.body;

    if (!name || !category) {
      res.status(400).json({
        success: false,
        error: {
          message: "name y category son obligatorios",
        },
      });

      return;
    }

    if (!validCategories.includes(category)) {
      res.status(400).json({
        success: false,
        error: {
          message: "Categoría de servicio inválida",
        },
      });

      return;
    }

    const service = await serviceService.create({
      name,
      description,
      category,
      price,
      currency,
      active,
    });

    res.status(201).json({
      success: true,
      data: service,
    });
  },

  async update(req: Request<IdParams>, res: Response) {
    const { id } = req.params;

    const existing = await serviceService.getById(id);

    if (!existing) {
      res.status(404).json({
        success: false,
        error: {
          message: "Servicio no encontrado",
        },
      });

      return;
    }

    const service = await serviceService.update(
      id,
      req.body
    );

    res.status(200).json({
      success: true,
      data: service,
    });
  },

  async deactivate(
    req: Request<IdParams>,
    res: Response
  ) {
    const { id } = req.params;

    const existing = await serviceService.getById(id);

    if (!existing) {
      res.status(404).json({
        success: false,
        error: {
          message: "Servicio no encontrado",
        },
      });

      return;
    }

    const service =
      await serviceService.deactivate(id);

    res.status(200).json({
      success: true,
      data: service,
    });
  },
};