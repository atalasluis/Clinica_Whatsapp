import { Request, Response } from "express";
import { clientService } from "./client.service";

type IdParams = {
  id: string;
};

export const clientController = {
  async getAll(req: Request, res: Response) {
    const clients = await clientService.getAll();

    res.status(200).json({
      success: true,
      data: clients,
    });
  },

  async getById(req: Request<IdParams>, res: Response) {
    const { id } = req.params;

    const client = await clientService.getById(id);

    if (!client) {
      res.status(404).json({
        success: false,
        error: {
          message: "Cliente no encontrado",
        },
      });

      return;
    }

    res.status(200).json({
      success: true,
      data: client,
    });
  },

  async create(req: Request, res: Response) {
    const {
      firstName,
      lastName,
      phone,
      email,
    } = req.body;

    if (!phone) {
      res.status(400).json({
        success: false,
        error: {
          message: "El teléfono es obligatorio",
        },
      });

      return;
    }

    const existing = await clientService.getByPhone(phone);

    if (existing) {
      res.status(409).json({
        success: false,
        error: {
          message: "Ya existe un cliente con ese teléfono",
        },
      });

      return;
    }

    const client = await clientService.create({
      firstName,
      lastName,
      phone,
      email,
    });

    res.status(201).json({
      success: true,
      data: client,
    });
  },

  async update(req: Request<IdParams>, res: Response) {
    const { id } = req.params;

    const existing = await clientService.getById(id);

    if (!existing) {
      res.status(404).json({
        success: false,
        error: {
          message: "Cliente no encontrado",
        },
      });

      return;
    }

    const client = await clientService.update(
      id,
      req.body
    );

    res.status(200).json({
      success: true,
      data: client,
    });
  },
};