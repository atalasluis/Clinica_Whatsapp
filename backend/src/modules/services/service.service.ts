import { prisma } from "../../lib/prisma";
import { ServiceCategory } from "../../generated/prisma/enums";

interface CreateServiceData {
  name: string;
  description?: string | null;
  category: ServiceCategory;
  price?: number | string | null;
  currency?: string;
  active?: boolean;
}

interface UpdateServiceData {
  name?: string;
  description?: string | null;
  category?: ServiceCategory;
  price?: number | string | null;
  currency?: string;
  active?: boolean;
}

export const serviceService = {
  async getAll() {
    return prisma.service.findMany({
      orderBy: {
        name: "asc",
      },
    });
  },

  async getById(id: string) {
    return prisma.service.findUnique({
      where: {
        id,
      },
      include: {
        professionals: {
          include: {
            professional: true,
          },
        },
        schedules: true,
      },
    });
  },

  async create(data: CreateServiceData) {
    return prisma.service.create({
      data: {
        name: data.name,
        description: data.description,
        category: data.category,
        price: data.price,
        currency: data.currency ?? "BOB",
        active: data.active ?? true,
      },
    });
  },

  async update(id: string, data: UpdateServiceData) {
    return prisma.service.update({
      where: {
        id,
      },
      data,
    });
  },

  async deactivate(id: string) {
    return prisma.service.update({
      where: {
        id,
      },
      data: {
        active: false,
      },
    });
  },
};