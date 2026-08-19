import prisma from "../../lib/prisma";

export async function findAll() {
  return prisma.conversations.findMany({
    where: { status: "HUMAN_ATTENTION" },
    include: {
      clients: true,
      messages: { orderBy: { createdAt: "desc" }, take: 5 },
      leads: true,
    },
    orderBy: { startedAt: "desc" },
  });
}

export async function escalate(conversationId: string, notes?: string) {
  const conversation = await prisma.conversations.update({
    where: { id: conversationId },
    data: { status: "HUMAN_ATTENTION" },
  });

  const lead = await prisma.leads.findFirst({ where: { conversationId } });
  if (lead) {
    await prisma.leads.update({
      where: { id: lead.id },
      data: { notes: notes ? `${lead.notes}\n[ESCALADO] ${notes}` : `${lead.notes}\n[ESCALADO] Requiere atención humana` },
    });
  }

  return conversation;
}

export async function resolve(conversationId: string) {
  return prisma.conversations.update({
    where: { id: conversationId },
    data: { status: "CLOSED", closedAt: new Date() },
  });
}

export async function stats() {
  const [total, pending, resolved] = await Promise.all([
    prisma.conversations.count({ where: { status: "HUMAN_ATTENTION" } }),
    prisma.conversations.count({ where: { status: "HUMAN_ATTENTION" } }),
    prisma.conversations.count({ where: { status: "CLOSED" } }),
  ]);
  return { totalEscalated: total, currentlyPending: pending, resolved };
}
