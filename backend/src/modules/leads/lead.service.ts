import prisma from "../../lib/prisma";
import { LeadStatus } from "../../generated/prisma/client";

export async function findAll() {
  return prisma.leads.findMany({
    orderBy: { createdAt: "desc" },
    include: { clients: true, specialties: true, services: true },
  });
}

export async function findById(id: string) {
  return prisma.leads.findUnique({
    where: { id },
    include: {
      clients: true,
      specialties: true,
      services: true,
      conversations: true,
    },
  });
}

export async function create(data: {
  clientId: string;
  conversationId?: string;
  specialtyId?: string;
  serviceId?: string;
  notes?: string;
}) {
  return prisma.leads.create({ data });
}

export async function update(
  id: string,
  data: {
    status?: LeadStatus;
    specialtyId?: string;
    serviceId?: string;
    notes?: string;
  }
) {
  return prisma.leads.update({ where: { id }, data });
}
