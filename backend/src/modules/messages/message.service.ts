import { prisma } from "../../lib/prisma";
import {
  MessageSender,
  MessageType,
} from "../../generated/prisma/enums";
import { Prisma } from "../../generated/prisma/client";

interface CreateMessageData {
  conversationId: string;
  sender: MessageSender;
  type: MessageType;
  content?: string | null;
  mediaUrl?: string | null;
  metadata?: Prisma.InputJsonValue;
}

export const messageService = {
  async getById(id: string) {
    return prisma.message.findUnique({
      where: { id },
    });
  },

  async getByConversation(
    conversationId: string
  ) {
    return prisma.message.findMany({
      where: {
        conversationId,
      },

      orderBy: {
        createdAt: "asc",
      },
    });
  },

  async create(data: CreateMessageData) {
    return prisma.message.create({
      data,
    });
  },
};