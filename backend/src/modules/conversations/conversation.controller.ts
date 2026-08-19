import { Request, Response } from "express";
import { conversationService } from "./conversation.service";
import { ConversationStatus } from "../../generated/prisma/enums";

type IdParams = {
  id: string;
};

const validStatuses = Object.values(ConversationStatus);

export const conversationController = {
  async getAll(req: Request, res: Response) {
    const conversations =
      await conversationService.getAll();

    res.status(200).json({
      success: true,
      data: conversations,
    });
  },

  async getById(req: Request<IdParams>, res: Response) {
    const { id } = req.params;

    const conversation =
      await conversationService.getById(id);

    if (!conversation) {
      res.status(404).json({
        success: false,
        error: {
          message: "Conversación no encontrada",
        },
      });

      return;
    }

    res.status(200).json({
      success: true,
      data: conversation,
    });
  },

  async create(req: Request, res: Response) {
    const {
      clientId,
      externalId,
      status,
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
          message: "Estado de conversación inválido",
        },
      });

      return;
    }

    const conversation =
      await conversationService.create({
        clientId,
        externalId,
        status,
      });

    res.status(201).json({
      success: true,
      data: conversation,
    });
  },

  async update(req: Request<IdParams>, res: Response) {
    const { id } = req.params;

    const existing =
      await conversationService.getById(id);

    if (!existing) {
      res.status(404).json({
        success: false,
        error: {
          message: "Conversación no encontrada",
        },
      });

      return;
    }

    const conversation =
      await conversationService.update(
        id,
        req.body
      );

    res.status(200).json({
      success: true,
      data: conversation,
    });
  },

  async close(req: Request<IdParams>, res: Response) {
    const { id } = req.params;

    const existing =
      await conversationService.getById(id);

    if (!existing) {
      res.status(404).json({
        success: false,
        error: {
          message: "Conversación no encontrada",
        },
      });

      return;
    }

    const conversation =
      await conversationService.close(id);

    res.status(200).json({
      success: true,
      data: conversation,
    });
  },
};