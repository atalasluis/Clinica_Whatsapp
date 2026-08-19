import { Request, Response } from "express";
import { leadService } from "./lead.service";
import { LeadStatus } from "../../generated/prisma/enums";

type IdParams = {
  id: string;
};

const validStatuses = Object.values(LeadStatus);

export const leadController = {
  async getAll(req: Request, res: Response) {
    const leads = await leadService.getAll();

    res.status(200).json({
      success: true,
      data: leads,
    });
  },

  async getById(req: Request<IdParams>, res: Response) {
    const { id } = req.params;

    const lead = await leadService.getById(id);

    if (!lead) {
      res.status(404).json({
        success: false,
        error: {
          message: "Lead no encontrado",
        },
      });

      return;
    }

    res.status(200).json({
      success: true,
      data: lead,
    });
  },

  async create(req: Request, res: Response) {
    const {
      clientId,
      conversationId,
      specialtyId,
      serviceId,
      status,
      notes,
    } = req.body;

    if (!clientId) {
      res.status(400).json({
        success: false,
        error: {
          message: "clientId es obligatorio",
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
          message: "Estado de lead inválido",
        },
      });

      return;
    }

    const lead = await leadService.create({
      clientId,
      conversationId,
      specialtyId,
      serviceId,
      status,
      notes,
    });

    res.status(201).json({
      success: true,
      data: lead,
    });
  },

  async update(req: Request<IdParams>, res: Response) {
    const { id } = req.params;

    const existing = await leadService.getById(id);

    if (!existing) {
      res.status(404).json({
        success: false,
        error: {
          message: "Lead no encontrado",
        },
      });

      return;
    }

    if (
      req.body.status &&
      !validStatuses.includes(req.body.status)
    ) {
      res.status(400).json({
        success: false,
        error: {
          message: "Estado de lead inválido",
        },
      });

      return;
    }

    const lead = await leadService.update(
      id,
      req.body
    );

    res.status(200).json({
      success: true,
      data: lead,
    });
  },
};