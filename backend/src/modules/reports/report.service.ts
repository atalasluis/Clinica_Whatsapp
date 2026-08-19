import prisma from "../../lib/prisma";

export async function dailyReport() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [messagesTotal, messagesFromClients, messagesFromBot, newConversations, closedConversations, newLeads, appointmentsToday, completedToday] = await Promise.all([
    prisma.messages.count({ where: { createdAt: { gte: today, lt: tomorrow } } }),
    prisma.messages.count({ where: { createdAt: { gte: today, lt: tomorrow }, sender: "CLIENT" } }),
    prisma.messages.count({ where: { createdAt: { gte: today, lt: tomorrow }, sender: "BOT" } }),
    prisma.conversations.count({ where: { startedAt: { gte: today, lt: tomorrow } } }),
    prisma.conversations.count({ where: { closedAt: { gte: today, lt: tomorrow } } }),
    prisma.leads.count({ where: { createdAt: { gte: today, lt: tomorrow } } }),
    prisma.appointments.count({ where: { scheduledAt: { gte: today, lt: tomorrow } } }),
    prisma.appointments.count({ where: { scheduledAt: { gte: today, lt: tomorrow }, status: "COMPLETED" } }),
  ]);

  return {
    date: today.toISOString().split("T")[0],
    messages: { total: messagesTotal, fromClients: messagesFromClients, fromBot: messagesFromBot },
    conversations: { new: newConversations, closed: closedConversations },
    leads: { new: newLeads },
    appointments: { total: appointmentsToday, completed: completedToday },
  };
}

export async function weeklyReport() {
  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);

  const [messagesTotal, messagesFromClients, messagesFromBot, newConversations, closedConversations, newLeads, totalAppointments, completedAppointments, cancelledAppointments] = await Promise.all([
    prisma.messages.count({ where: { createdAt: { gte: weekAgo } } }),
    prisma.messages.count({ where: { createdAt: { gte: weekAgo }, sender: "CLIENT" } }),
    prisma.messages.count({ where: { createdAt: { gte: weekAgo }, sender: "BOT" } }),
    prisma.conversations.count({ where: { startedAt: { gte: weekAgo } } }),
    prisma.conversations.count({ where: { closedAt: { gte: weekAgo } } }),
    prisma.leads.count({ where: { createdAt: { gte: weekAgo } } }),
    prisma.appointments.count({ where: { createdAt: { gte: weekAgo } } }),
    prisma.appointments.count({ where: { createdAt: { gte: weekAgo }, status: "COMPLETED" } }),
    prisma.appointments.count({ where: { createdAt: { gte: weekAgo }, status: "CANCELLED" } }),
  ]);

  const conversionRate = newLeads > 0 ? Math.round(((completedAppointments) / newLeads) * 100 * 100) / 100 : 0;

  return {
    period: `${weekAgo.toISOString().split("T")[0]} al ${now.toISOString().split("T")[0]}`,
    messages: { total: messagesTotal, fromClients: messagesFromClients, fromBot: messagesFromBot },
    conversations: { new: newConversations, closed: closedConversations },
    leads: { new: newLeads },
    appointments: { total: totalAppointments, completed: completedAppointments, cancelled: cancelledAppointments },
    conversionRate,
  };
}
