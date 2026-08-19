import { prisma } from "../../lib/prisma";

interface CreateSpecialtyData {
  name: string;
  description?: string | null;
  active?: boolean;
}

interface UpdateSpecialtyData {
  name?: string;
  description?: string | null;
  active?: boolean;
}

export const specialtyService = {
  async getAll() {
    return prisma.specialty.findMany({
      orderBy: {
        name: "asc",
      },
    });
  },

  async getById(id: string) {
    return prisma.specialty.findUnique({
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

  async create(data: CreateSpecialtyData) {
    return prisma.specialty.create({
      data: {
        name: data.name,
        description: data.description,
        active: data.active ?? true,
      },
    });
  },

  async update(id: string, data: UpdateSpecialtyData) {
    return prisma.specialty.update({
      where: {
        id,
      },
      data,
    });
  },

  async deactivate(id: string) {
    return prisma.specialty.update({
      where: {
        id,
      },
      data: {
        active: false,
      },
    });
  },
};