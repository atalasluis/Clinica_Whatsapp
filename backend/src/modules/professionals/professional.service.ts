import { prisma } from "../../lib/prisma";

interface CreateProfessionalData {
  firstName: string;
  lastName?: string | null;
  title?: string | null;
  active?: boolean;

  specialtyIds?: string[];
  serviceIds?: string[];
}

interface UpdateProfessionalData {
  firstName?: string;
  lastName?: string | null;
  title?: string | null;
  active?: boolean;

  specialtyIds?: string[];
  serviceIds?: string[];
}

export const professionalService = {
  async getAll() {
    return prisma.professional.findMany({
      include: {
        specialties: {
          include: {
            specialty: true,
          },
        },

        services: {
          include: {
            service: true,
          },
        },
      },

      orderBy: {
        firstName: "asc",
      },
    });
  },

  async getById(id: string) {
    return prisma.professional.findUnique({
      where: {
        id,
      },

      include: {
        specialties: {
          include: {
            specialty: true,
          },
        },

        services: {
          include: {
            service: true,
          },
        },

        schedules: {
          include: {
            specialty: true,
            service: true,
          },
        },
      },
    });
  },

  async create(data: CreateProfessionalData) {
    const {
      specialtyIds,
      serviceIds,
      ...professionalData
    } = data;

    return prisma.professional.create({
      data: {
        ...professionalData,

        specialties: specialtyIds?.length
          ? {
              create: specialtyIds.map((specialtyId) => ({
                specialty: {
                  connect: {
                    id: specialtyId,
                  },
                },
              })),
            }
          : undefined,

        services: serviceIds?.length
          ? {
              create: serviceIds.map((serviceId) => ({
                service: {
                  connect: {
                    id: serviceId,
                  },
                },
              })),
            }
          : undefined,
      },

      include: {
        specialties: {
          include: {
            specialty: true,
          },
        },

        services: {
          include: {
            service: true,
          },
        },
      },
    });
  },

  async update(id: string, data: UpdateProfessionalData) {
    const {
      specialtyIds,
      serviceIds,
      ...professionalData
    } = data;

    return prisma.professional.update({
      where: {
        id,
      },

      data: {
        ...professionalData,

        specialties:
          specialtyIds !== undefined
            ? {
                deleteMany: {},

                create: specialtyIds.map((specialtyId) => ({
                  specialty: {
                    connect: {
                      id: specialtyId,
                    },
                  },
                })),
              }
            : undefined,

        services:
          serviceIds !== undefined
            ? {
                deleteMany: {},

                create: serviceIds.map((serviceId) => ({
                  service: {
                    connect: {
                      id: serviceId,
                    },
                  },
                })),
              }
            : undefined,
      },

      include: {
        specialties: {
          include: {
            specialty: true,
          },
        },

        services: {
          include: {
            service: true,
          },
        },
      },
    });
  },

  async deactivate(id: string) {
    return prisma.professional.update({
      where: {
        id,
      },

      data: {
        active: false,
      },
    });
  },
};