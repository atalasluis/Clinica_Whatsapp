import { prisma } from "../../lib/prisma";

interface CreateClientData {
  firstName?: string | null;
  lastName?: string | null;
  phone: string;
  email?: string | null;
}

interface UpdateClientData {
  firstName?: string | null;
  lastName?: string | null;
  phone?: string;
  email?: string | null;
}

export const clientService = {
  async getAll() {
    return prisma.client.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  async getById(id: string) {
    return prisma.client.findUnique({
      where: { id },

      include: {
        conversations: true,
        leads: true,
        appointments: true,
      },
    });
  },

  async getByPhone(phone: string) {
    return prisma.client.findUnique({
      where: { phone },
    });
  },

  async create(data: CreateClientData) {
    return prisma.client.create({
      data,
    });
  },

  async update(id: string, data: UpdateClientData) {
    return prisma.client.update({
      where: { id },
      data,
    });
  },
};