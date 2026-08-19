import prisma from "../../lib/prisma";

export interface Alert {
  id: string;
  type: "ESCALATION" | "FOLLOW_UP" | "EMERGENCY" | "STALE_LEAD" | "APPOINTMENT_TODAY";
  severity: "INFO" | "WARNING" | "CRITICAL";
  title: string;
  description: string;
  createdAt: string;
}

export async function getAlerts(): Promise<Alert[]> {
  const alerts: Alert[] = [];
  const now = new Date();

  const escalated = await prisma.conversations.count({ where: { status: "HUMAN_ATTENTION" } });
  if (escalated > 0) {
    alerts.push({
      id: "esc-" + escalated,
      type: "ESCALATION",
      severity: "WARNING",
      title: `${escalated} conversación(es) escalada(s)`,
      description: "Hay conversaciones que requieren atención humana.",
      createdAt: now.toISOString(),
    });
  }

  const staleLeads = await prisma.leads.count({
    where: {
      status: { in: ["NEW", "QUALIFIED", "CONTACTED"] },
      updatedAt: { lt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000) },
    },
  });
  if (staleLeads > 0) {
    alerts.push({
      id: "fu-" + staleLeads,
      type: "FOLLOW_UP",
      severity: "WARNING",
      title: `${staleLeads} lead(s) sin seguimiento`,
      description: "Hay leads con más de 3 días sin contacto.",
      createdAt: now.toISOString(),
    });
  }

  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(now);
  todayEnd.setHours(23, 59, 59, 999);

  const todayAppts = await prisma.appointments.count({
    where: {
      scheduledAt: { gte: todayStart, lte: todayEnd },
      status: { in: ["CONFIRMED", "PENDING"] },
    },
  });
  if (todayAppts > 0) {
    alerts.push({
      id: "apt-" + todayAppts,
      type: "APPOINTMENT_TODAY",
      severity: "INFO",
      title: `${todayAppts} cita(s) programada(s) para hoy`,
      description: "Citas pendientes de atención hoy.",
      createdAt: now.toISOString(),
    });
  }

  const lostLeads = await prisma.leads.count({ where: { status: "LOST" } });
  if (lostLeads > 0) {
    alerts.push({
      id: "lost-" + lostLeads,
      type: "STALE_LEAD",
      severity: "INFO",
      title: `${lostLeads} lead(s) perdido(s)`,
      description: "Leads marcados como perdidos que podrían recuperarse.",
      createdAt: now.toISOString(),
    });
  }

  return alerts.sort((a, b) => {
    const sev = { CRITICAL: 0, WARNING: 1, INFO: 2 };
    return sev[a.severity] - sev[b.severity];
  });
}

export async function alertCount() {
  const alerts = await getAlerts();
  return { total: alerts.length, critical: alerts.filter(a => a.severity === "CRITICAL").length, warnings: alerts.filter(a => a.severity === "WARNING").length, info: alerts.filter(a => a.severity === "INFO").length };
}
