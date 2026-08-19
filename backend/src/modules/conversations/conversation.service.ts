import prisma from "../../lib/prisma";
import { ConversationStatus } from "../../generated/prisma/client";

export async function findAll() {
  return prisma.conversations.findMany({
    orderBy: { startedAt: "desc" },
    include: { clients: true },
  });
}

export async function findById(id: string) {
  return prisma.conversations.findUnique({
    where: { id },
    include: { clients: true, messages: { orderBy: { createdAt: "asc" } } },
  });
}

export async function findByExternalId(externalId: string) {
  return prisma.conversations.findUnique({
    where: { externalId },
    include: { clients: true },
  });
}

export async function create(data: {
  clientId: string;
  externalId?: string;
}) {
  return prisma.conversations.create({ data });
}

export async function close(id: string) {
  return prisma.conversations.update({
    where: { id },
    data: { status: ConversationStatus.CLOSED, closedAt: new Date() },
  });
}

export async function update(
  id: string,
  data: { status?: ConversationStatus }
) {
  return prisma.conversations.update({ where: { id }, data });
}
