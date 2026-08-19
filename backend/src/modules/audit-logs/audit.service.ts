import prisma from "../../lib/prisma";

export async function log(action: string, entityType: string, entityId: string, userId?: string, details?: string) {
  return { action, entityType, entityId, userId, details, timestamp: new Date().toISOString() };
}

export async function getRecentActivity(limit: number = 50) {
  const [recentConversations, recentAppointments, recentLeads] = await Promise.all([
    prisma.conversations.findMany({
      orderBy: { startedAt: "desc" },
      take: limit,
      include: { clients: true },
    }),
    prisma.appointments.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      include: { clients: true, professionals: true, specialties: true },
    }),
    prisma.leads.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      include: { clients: true, specialties: true },
    }),
  ]);

  const activity: Array<{
    type: string;
    description: string;
    timestamp: string;
    entity?: string;
  }> = [];

  for (const c of recentConversations) {
    const name = [c.clients.firstName, c.clients.lastName].filter(Boolean).join(" ") || c.clients.phone;
    activity.push({
      type: "CONVERSATION",
      description: `Nueva conversación con ${name} — Estado: ${c.status}`,
      timestamp: c.startedAt.toISOString(),
      entity: c.id,
    });
  }

  for (const a of recentAppointments) {
    const name = [a.clients.firstName, a.clients.lastName].filter(Boolean).join(" ") || a.clients.phone;
    const prof = a.professionals ? `${a.professionals.title || ""} ${a.professionals.firstName} ${a.professionals.lastName || ""}`.trim() : "";
    activity.push({
      type: "APPOINTMENT",
      description: `Cita ${a.status.toLowerCase()} — ${name}${prof ? ` con ${prof}` : ""}`,
      timestamp: a.createdAt.toISOString(),
      entity: a.id,
    });
  }

  for (const l of recentLeads) {
    const name = [l.clients.firstName, l.clients.lastName].filter(Boolean).join(" ") || l.clients.phone;
    activity.push({
      type: "LEAD",
      description: `Lead ${l.status.toLowerCase()} — ${name}${l.specialties ? ` (${l.specialties.name})` : ""}`,
      timestamp: l.createdAt.toISOString(),
      entity: l.id,
    });
  }

  return activity.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, limit);
}
