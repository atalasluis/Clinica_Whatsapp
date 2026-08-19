import prisma from "../../lib/prisma";

export async function findDuplicateClients() {
  const byPhone = await prisma.clients.groupBy({
    by: ["phone"],
    _count: { id: true },
    having: { id: { _count: { gt: 1 } } },
  });

  const duplicates = [];
  for (const group of byPhone) {
    const clients = await prisma.clients.findMany({
      where: { phone: group.phone },
      orderBy: { createdAt: "asc" },
    });
    duplicates.push({
      field: "phone",
      value: group.phone,
      count: group._count.id,
      clients,
    });
  }

  const byEmail = await prisma.clients.groupBy({
    by: ["email"],
    _count: { id: true },
    having: { id: { _count: { gt: 1 } } },
    where: { email: { not: null } },
  });

  for (const group of byEmail) {
    if (!group.email) continue;
    const clients = await prisma.clients.findMany({
      where: { email: group.email },
      orderBy: { createdAt: "asc" },
    });
    duplicates.push({
      field: "email",
      value: group.email,
      count: group._count.id,
      clients,
    });
  }

  return duplicates;
}

export async function mergeClients(keepId: string, removeId: string) {
  const keepClient = await prisma.clients.findUnique({ where: { id: keepId } });
  const removeClient = await prisma.clients.findUnique({ where: { id: removeId } });
  if (!keepClient || !removeClient) throw new Error("Cliente no encontrado");

  await prisma.conversations.updateMany({
    where: { clientId: removeId },
    data: { clientId: keepId },
  });

  await prisma.leads.updateMany({
    where: { clientId: removeId },
    data: { clientId: keepId },
  });

  await prisma.appointments.updateMany({
    where: { clientId: removeId },
    data: { clientId: keepId },
  });

  await prisma.clients.update({
    where: { id: keepId },
    data: {
      firstName: keepClient.firstName || removeClient.firstName,
      lastName: keepClient.lastName || removeClient.lastName,
      email: keepClient.email || removeClient.email,
    },
  });

  await prisma.clients.delete({ where: { id: removeId } });

  return { merged: true, kept: keepId, removed: removeId };
}
