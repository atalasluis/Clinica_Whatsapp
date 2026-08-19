import { prisma } from "../../lib/prisma";

export const analyticsService = {
  async getOverview() {
    const [
      clients,
      conversations,
      messages,
      leads,
      appointments,
    ] = await Promise.all([
      prisma.client.count(),
      prisma.conversation.count(),
      prisma.message.count(),
      prisma.lead.count(),
      prisma.appointment.count(),
    ]);

    const conversionRate =
      leads === 0
        ? 0
        : Number(
            ((appointments / leads) * 100).toFixed(2)
          );

    return {
      clients,
      conversations,
      messages,
      leads,
      appointments,
      conversionRate,
    };
  },

  async getLeadsByStatus() {
    return prisma.lead.groupBy({
      by: ["status"],

      _count: {
        _all: true,
      },
    });
  },

  async getAppointmentsByStatus() {
    return prisma.appointment.groupBy({
      by: ["status"],

      _count: {
        _all: true,
      },
    });
  },

  async getPopularSpecialties() {
    return prisma.appointment.groupBy({
      by: ["specialtyId"],

      where: {
        specialtyId: {
          not: null,
        },
      },

      _count: {
        specialtyId: true,
      },

      orderBy: {
        _count: {
          specialtyId: "desc",
        },
      },
    });
  },
};