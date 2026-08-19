import prisma from "../../lib/prisma";

export async function overview() {
  const [
    totalClients,
    totalConversations,
    totalMessages,
    totalLeads,
    totalAppointments,
  ] = await Promise.all([
    prisma.clients.count(),
    prisma.conversations.count(),
    prisma.messages.count(),
    prisma.leads.count(),
    prisma.appointments.count(),
  ]);

  const conversionRate =
    totalLeads > 0
      ? Math.round(
          ((await prisma.appointments.count({
            where: { status: "CONFIRMED" },
          })) /
            totalLeads) *
            100 *
            100
        ) / 100
      : 0;

  return {
    totalClients,
    totalConversations,
    totalMessages,
    totalLeads,
    totalAppointments,
    conversionRate,
  };
}

export async function leadsByStatus() {
  const statuses = [
    "NEW",
    "QUALIFIED",
    "CONTACTED",
    "APPOINTMENT_BOOKED",
    "CLOSED",
    "LOST",
  ] as const;

  const results = await Promise.all(
    statuses.map(async (status) => ({
      status,
      count: await prisma.leads.count({ where: { status } }),
    }))
  );

  return results;
}

export async function appointmentsByStatus() {
  const statuses = [
    "PENDING",
    "CONFIRMED",
    "COMPLETED",
    "CANCELLED",
    "NO_SHOW",
  ] as const;

  const results = await Promise.all(
    statuses.map(async (status) => ({
      status,
      count: await prisma.appointments.count({ where: { status } }),
    }))
  );

  return results;
}

export async function topSpecialties() {
  const results = await prisma.leads.groupBy({
    by: ["specialtyId"],
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
    take: 10,
  });

  const specialties = await Promise.all(
    results
      .filter((r): r is typeof r & { specialtyId: string } => r.specialtyId !== null)
      .map(async (r) => {
        const specialty = await prisma.specialties.findUnique({
          where: { id: r.specialtyId },
        });
        return {
          specialty: specialty?.name ?? "Desconocido",
          count: r._count.id,
        };
      })
  );

  return specialties;
}
