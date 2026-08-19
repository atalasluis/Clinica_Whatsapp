import prisma from "../../lib/prisma";
import { MessageSender, MessageType } from "../../generated/prisma/client";

export async function findById(id: string) {
  return prisma.messages.findUnique({ where: { id } });
}

export async function findByConversation(conversationId: string) {
  return prisma.messages.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
  });
}

export async function create(data: {
  conversationId: string;
  sender: MessageSender;
  type?: MessageType;
  content?: string;
  mediaUrl?: string;
  metadata?: object;
}) {
  return prisma.messages.create({
    data: {
      conversationId: data.conversationId,
      sender: data.sender,
      type: data.type ?? MessageType.TEXT,
      content: data.content ?? undefined,
      mediaUrl: data.mediaUrl ?? undefined,
      metadata: data.metadata ?? undefined,
    },
  });
}
