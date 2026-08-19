import { Request, Response } from "express";
import { messageService } from "./message.service";
import {
  MessageSender,
  MessageType,
} from "../../generated/prisma/enums";

type IdParams = {
  id: string;
};

type ConversationParams = {
  conversationId: string;
};

const validSenders = Object.values(MessageSender);
const validTypes = Object.values(MessageType);

export const messageController = {
  async getById(req: Request<IdParams>, res: Response) {
    const { id } = req.params;

    const message = await messageService.getById(id);

    if (!message) {
      res.status(404).json({
        success: false,
        error: {
          message: "Mensaje no encontrado",
        },
      });

      return;
    }

    res.status(200).json({
      success: true,
      data: message,
    });
  },

  async getByConversation(
    req: Request<ConversationParams>,
    res: Response
  ) {
    const { conversationId } = req.params;

    const messages =
      await messageService.getByConversation(
        conversationId
      );

    res.status(200).json({
      success: true,
      data: messages,
    });
  },

  async create(req: Request, res: Response) {
    const {
      conversationId,
      sender,
      type,
      content,
      mediaUrl,
      metadata,
    } = req.body;

    if (!conversationId || !sender || !type) {
      res.status(400).json({
        success: false,
        error: {
          message:
            "conversationId, sender y type son obligatorios",
        },
      });

      return;
    }

    if (!validSenders.includes(sender)) {
      res.status(400).json({
        success: false,
        error: {
          message: "Sender inválido",
        },
      });

      return;
    }

    if (!validTypes.includes(type)) {
      res.status(400).json({
        success: false,
        error: {
          message: "Tipo de mensaje inválido",
        },
      });

      return;
    }

    const message = await messageService.create({
      conversationId,
      sender,
      type,
      content,
      mediaUrl,
      metadata,
    });

    res.status(201).json({
      success: true,
      data: message,
    });
  },
};