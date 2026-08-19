import prisma from "../../lib/prisma";

export async function getLeadsNeedingFollowUp() {
  const leads = await prisma.leads.findMany({
    where: {
      status: { in: ["NEW", "QUALIFIED", "CONTACTED"] },
    },
    include: { clients: true, specialties: true, services: true },
    orderBy: { createdAt: "asc" },
  });

  const now = new Date();
  return leads.map((lead) => {
    const daysSinceCreated = Math.floor((now.getTime() - new Date(lead.createdAt).getTime()) / (1000 * 60 * 60 * 24));
    const daysSinceUpdated = Math.floor((now.getTime() - new Date(lead.updatedAt).getTime()) / (1000 * 60 * 60 * 24));

    let priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT" = "LOW";
    if (daysSinceUpdated >= 7) priority = "URGENT";
    else if (daysSinceUpdated >= 3) priority = "HIGH";
    else if (daysSinceUpdated >= 1) priority = "MEDIUM";

    return {
      ...lead,
      daysSinceCreated,
      daysSinceUpdated,
      priority,
    };
  });
}

export async function markFollowedUp(leadId: string, notes: string) {
  const lead = await prisma.leads.update({
    where: { id: leadId },
    data: {
      status: "CONTACTED",
      notes: notes ? `${notes}` : undefined,
    },
  });
  return lead;
}

export async function stats() {
  const [newLeads, qualified, contacted, appointmentBooked, closed, lost] = await Promise.all([
    prisma.leads.count({ where: { status: "NEW" } }),
    prisma.leads.count({ where: { status: "QUALIFIED" } }),
    prisma.leads.count({ where: { status: "CONTACTED" } }),
    prisma.leads.count({ where: { status: "APPOINTMENT_BOOKED" } }),
    prisma.leads.count({ where: { status: "CLOSED" } }),
    prisma.leads.count({ where: { status: "LOST" } }),
  ]);

  const total = newLeads + qualified + contacted + appointmentBooked + closed + lost;
  const conversionRate = total > 0 ? Math.round(((appointmentBooked + closed) / total) * 100 * 100) / 100 : 0;

  return { newLeads, qualified, contacted, appointmentBooked, closed, lost, total, conversionRate };
}
