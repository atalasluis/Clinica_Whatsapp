import prisma from "../../lib/prisma";
import { AppointmentStatus, AppointmentSource } from "../../generated/prisma/client";

export async function findAll() {
  return prisma.appointments.findMany({
    orderBy: { scheduledAt: "desc" },
    include: {
      clients: true,
      professionals: true,
      specialties: true,
      services: true,
    },
  });
}

export async function findById(id: string) {
  return prisma.appointments.findUnique({
    where: { id },
    include: {
      clients: true,
      professionals: true,
      specialties: true,
      services: true,
    },
  });
}

export async function create(data: {
  clientId: string;
  professionalId: string;
  specialtyId?: string;
  serviceId?: string;
  scheduledAt: string;
  source?: AppointmentSource;
  notes?: string;
}) {
  return prisma.appointments.create({
    data: {
      clientId: data.clientId,
      professionalId: data.professionalId,
      specialtyId: data.specialtyId ?? undefined,
      serviceId: data.serviceId ?? undefined,
      scheduledAt: new Date(data.scheduledAt),
      source: data.source ?? AppointmentSource.MANUAL,
      notes: data.notes ?? undefined,
    },
  });
}

export async function update(
  id: string,
  data: {
    status?: AppointmentStatus;
    notes?: string;
    scheduledAt?: string;
  }
) {
  return prisma.appointments.update({
    where: { id },
    data: {
      status: data.status ?? undefined,
      notes: data.notes ?? undefined,
      scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : undefined,
    },
  });
}

export async function cancel(id: string) {
  return prisma.appointments.update({
    where: { id },
    data: { status: AppointmentStatus.CANCELLED },
  });
}
