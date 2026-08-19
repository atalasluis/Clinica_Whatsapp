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

export async function totalMessagesReceived() {
  const count = await prisma.messages.count({
    where: { sender: "CLIENT" },
  });
  return { totalMessagesReceived: count };
}

export async function messagesAutoAttended() {
  const count = await prisma.messages.count({
    where: { sender: "BOT" },
  });
  return { messagesAutoAttended: count };
}

export async function conversationsPending() {
  const count = await prisma.conversations.count({
    where: { status: "OPEN" },
  });
  return { conversationsPending: count };
}

export async function avgResponseTime() {
  const clientMessages = await prisma.messages.findMany({
    where: { sender: "CLIENT" },
    orderBy: { createdAt: "asc" },
    select: { conversationId: true, createdAt: true },
  });

  if (clientMessages.length === 0) return { avgResponseTime: 0 };

  let totalSeconds = 0;
  let count = 0;

  for (const msg of clientMessages) {
    const nextBot = await prisma.messages.findFirst({
      where: {
        conversationId: msg.conversationId,
        sender: { in: ["BOT", "STAFF"] },
        createdAt: { gt: msg.createdAt },
      },
      orderBy: { createdAt: "asc" },
      select: { createdAt: true },
    });

    if (nextBot) {
      totalSeconds += (nextBot.createdAt.getTime() - msg.createdAt.getTime()) / 1000;
      count++;
    }
  }

  const avgMinutes = count > 0 ? Math.round((totalSeconds / count / 60) * 100) / 100 : 0;
  return { avgResponseTime: avgMinutes };
}

export async function messagesPerDay() {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const messages = await prisma.messages.groupBy({
    by: ["createdAt"],
    _count: { id: true },
    where: { createdAt: { gte: sevenDaysAgo } },
    orderBy: { createdAt: "asc" },
  });

  const dayMap: Record<string, number> = {};
  for (const m of messages) {
    const date = m.createdAt.toISOString().split("T")[0];
    dayMap[date] = (dayMap[date] || 0) + Number(m._count.id);
  }

  return Object.entries(dayMap).map(([date, count]) => ({ date, count }));
}

export async function leadsBySource() {
  const result = await prisma.appointments.groupBy({
    by: ["source"],
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
  });
  return result.map((r) => ({ source: r.source, count: r._count.id }));
}

export async function appointmentConversionRate() {
  const [total, confirmed, completed] = await Promise.all([
    prisma.appointments.count(),
    prisma.appointments.count({ where: { status: "CONFIRMED" } }),
    prisma.appointments.count({ where: { status: "COMPLETED" } }),
  ]);
  const converted = confirmed + completed;
  const rate = total > 0 ? Math.round((converted / total) * 100 * 100) / 100 : 0;
  return { total, converted, rate };
}

export async function escalatedConversations() {
  const count = await prisma.conversations.count({
    where: { status: "HUMAN_ATTENTION" },
  });
  return { escalatedConversations: count };
}

export async function performanceBySpecialty() {
  const results = await prisma.leads.groupBy({
    by: ["specialtyId"],
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
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

export async function appointmentsPerDay() {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const appointments = await prisma.appointments.groupBy({
    by: ["scheduledAt"],
    _count: { id: true },
    where: { scheduledAt: { gte: sevenDaysAgo } },
    orderBy: { scheduledAt: "asc" },
  });

  const dayMap: Record<string, number> = {};
  for (const a of appointments) {
    const date = a.scheduledAt.toISOString().split("T")[0];
    dayMap[date] = (dayMap[date] || 0) + Number(a._count.id);
  }

  return Object.entries(dayMap).map(([date, count]) => ({ date, count }));
}

export async function todaySummary() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [messagesToday, conversationsToday, appointmentsToday] = await Promise.all([
    prisma.messages.count({
      where: { createdAt: { gte: today, lt: tomorrow } },
    }),
    prisma.conversations.count({
      where: { startedAt: { gte: today, lt: tomorrow } },
    }),
    prisma.appointments.count({
      where: { scheduledAt: { gte: today, lt: tomorrow } },
    }),
  ]);

  return { messagesToday, conversationsToday, appointmentsToday };
}
