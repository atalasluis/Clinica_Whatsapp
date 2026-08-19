import { prisma } from "../../lib/prisma";
import { ConversationStatus } from "../../generated/prisma/enums";

interface CreateConversationData {
  clientId: string;
  externalId?: string | null;
  status?: ConversationStatus;
}

interface UpdateConversationData {
  status?: ConversationStatus;
  closedAt?: Date | null;
}

export const conversationService = {
  async getAll() {
    return prisma.conversation.findMany({
      include: {
        client: true,
      },

      orderBy: {
        startedAt: "desc",
      },
    });
  },

  async getById(id: string) {
    return prisma.conversation.findUnique({
      where: { id },

      include: {
        client: true,

        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },

        leads: true,
      },
    });
  },

  async getByExternalId(externalId: string) {
    return prisma.conversation.findUnique({
      where: {
        externalId,
      },
    });
  },

  async create(data: CreateConversationData) {
    return prisma.conversation.create({
      data: {
        clientId: data.clientId,
        externalId: data.externalId,
        status: data.status ?? ConversationStatus.OPEN,
      },
    });
  },

  async update(
    id: string,
    data: UpdateConversationData
  ) {
    return prisma.conversation.update({
      where: { id },
      data,
    });
  },

  async close(id: string) {
    return prisma.conversation.update({
      where: { id },

      data: {
        status: ConversationStatus.CLOSED,
        closedAt: new Date(),
      },
    });
  },
};