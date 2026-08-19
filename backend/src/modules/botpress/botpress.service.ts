import prisma from "../../lib/prisma";
import { MessageSender, MessageType } from "../../generated/prisma/client";

interface BotpressWebhookPayload {
  phone: string;
  firstName?: string;
  lastName?: string;
  externalConversationId?: string;
  message: {
    sender: MessageSender;
    type?: MessageType;
    content?: string;
    mediaUrl?: string;
    metadata?: object;
  };
}

export async function handleWebhook(payload: BotpressWebhookPayload) {
  const { phone, firstName, lastName, externalConversationId, message } =
    payload;

  // 1. Buscar o crear cliente
  let client = await prisma.clients.findUnique({ where: { phone } });
  if (!client) {
    client = await prisma.clients.create({
      data: {
        phone,
        firstName: firstName ?? undefined,
        lastName: lastName ?? undefined,
      },
    });
  } else if (firstName || lastName) {
    client = await prisma.clients.update({
      where: { id: client.id },
      data: {
        firstName: firstName || undefined,
        lastName: lastName || undefined,
      },
    });
  }

  // 2. Buscar o crear conversación
  let conversation;
  if (externalConversationId) {
    conversation = await prisma.conversations.findUnique({
      where: { externalId: externalConversationId },
    });
  }
  if (!conversation) {
    conversation = await prisma.conversations.create({
      data: {
        clientId: client.id,
        externalId: externalConversationId ?? undefined,
      },
    });
  }

  // 3. Guardar mensaje
  const savedMessage = await prisma.messages.create({
    data: {
      conversationId: conversation.id,
      sender: message.sender,
      type: message.type ?? MessageType.TEXT,
      content: message.content ?? undefined,
      mediaUrl: message.mediaUrl ?? undefined,
      metadata: message.metadata ?? undefined,
    },
  });

  return { client, conversation, message: savedMessage };
}
