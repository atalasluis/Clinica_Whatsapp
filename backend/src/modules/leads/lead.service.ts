import { prisma } from "../../lib/prisma";
import { LeadStatus } from "../../generated/prisma/enums";

interface CreateLeadData {
  clientId: string;
  conversationId?: string | null;
  specialtyId?: string | null;
  serviceId?: string | null;
  status?: LeadStatus;
  notes?: string | null;
}

interface UpdateLeadData {
  conversationId?: string | null;
  specialtyId?: string | null;
  serviceId?: string | null;
  status?: LeadStatus;
  notes?: string | null;
}

export const leadService = {
  async getAll() {
    return prisma.lead.findMany({
      include: {
        client: true,
        conversation: true,
        specialty: true,
        service: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  },

  async getById(id: string) {
    return prisma.lead.findUnique({
      where: { id },

      include: {
        client: true,
        conversation: true,
        specialty: true,
        service: true,
      },
    });
  },

  async create(data: CreateLeadData) {
    return prisma.lead.create({
      data: {
        ...data,
        status: data.status ?? LeadStatus.NEW,
      },

      include: {
        client: true,
        specialty: true,
        service: true,
      },
    });
  },

  async update(id: string, data: UpdateLeadData) {
    return prisma.lead.update({
      where: { id },
      data,

      include: {
        client: true,
        specialty: true,
        service: true,
      },
    });
  },
};