import { Request, Response } from "express";
import { botpressService } from "./botpress.service";

import {
  MessageSender,
  MessageType,
} from "../../generated/prisma/enums";

const validSenders =
  Object.values(MessageSender);

const validTypes =
  Object.values(MessageType);

export const botpressController = {
  async webhook(req: Request, res: Response) {
    const {
      phone,
      firstName,
      lastName,
      externalConversationId,
      message,
    } = req.body;

    if (
      !phone ||
      !externalConversationId ||
      !message
    ) {
      res.status(400).json({
        success: false,
        error: {
          message:
            "phone, externalConversationId y message son obligatorios",
        },
      });

      return;
    }

    if (
      !validSenders.includes(
        message.sender
      )
    ) {
      res.status(400).json({
        success: false,
        error: {
          message:
            "Sender de mensaje inválido",
        },
      });

      return;
    }

    if (
      !validTypes.includes(
        message.type
      )
    ) {
      res.status(400).json({
        success: false,
        error: {
          message:
            "Tipo de mensaje inválido",
        },
      });

      return;
    }

    const result =
      await botpressService.processMessage({
        phone,
        firstName,
        lastName,
        externalConversationId,
        message,
      });

    res.status(200).json({
      success: true,
      data: result,
    });
  },
};