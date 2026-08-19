import { prisma } from "../../lib/prisma";

import {
  ConversationStatus,
  MessageSender,
  MessageType,
} from "../../generated/prisma/enums";

interface BotpressMessageData {
  phone: string;

  firstName?: string;
  lastName?: string;

  externalConversationId: string;

  message: {
    sender: MessageSender;
    type: MessageType;

    content?: string;
    mediaUrl?: string;

    metadata?: any;
  };
}

export const botpressService = {
  async processMessage(data: BotpressMessageData) {
    let client = await prisma.client.findUnique({
      where: {
        phone: data.phone,
      },
    });

    if (!client) {
      client = await prisma.client.create({
        data: {
          phone: data.phone,
          firstName: data.firstName,
          lastName: data.lastName,
        },
      });
    }

    let conversation =
      await prisma.conversation.findUnique({
        where: {
          externalId:
            data.externalConversationId,
        },
      });

    if (!conversation) {
      conversation =
        await prisma.conversation.create({
          data: {
            clientId: client.id,

            externalId:
              data.externalConversationId,

            status:
              ConversationStatus.OPEN,
          },
        });
    }

    const message =
      await prisma.message.create({
        data: {
          conversationId: conversation.id,

          sender: data.message.sender,
          type: data.message.type,

          content: data.message.content,
          mediaUrl: data.message.mediaUrl,

          metadata: data.message.metadata,
        },
      });

    return {
      client,
      conversation,
      message,
    };
  },
};