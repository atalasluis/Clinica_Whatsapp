import { prisma } from "../../lib/prisma";
import {
  AppointmentSource,
  AppointmentStatus,
} from "../../generated/prisma/enums";

interface CreateAppointmentData {
  clientId: string;
  professionalId?: string | null;
  specialtyId?: string | null;
  serviceId?: string | null;

  scheduledAt: Date;

  status?: AppointmentStatus;
  source?: AppointmentSource;

  notes?: string | null;
}

interface UpdateAppointmentData {
  professionalId?: string | null;
  specialtyId?: string | null;
  serviceId?: string | null;

  scheduledAt?: Date;

  status?: AppointmentStatus;
  source?: AppointmentSource;

  notes?: string | null;
}

export const appointmentService = {
  async getAll() {
    return prisma.appointment.findMany({
      include: {
        client: true,
        professional: true,
        specialty: true,
        service: true,
      },

      orderBy: {
        scheduledAt: "asc",
      },
    });
  },

  async getById(id: string) {
    return prisma.appointment.findUnique({
      where: { id },

      include: {
        client: true,
        professional: true,
        specialty: true,
        service: true,
      },
    });
  },

  async create(data: CreateAppointmentData) {
    return prisma.appointment.create({
      data: {
        ...data,

        status:
          data.status ??
          AppointmentStatus.PENDING,

        source:
          data.source ??
          AppointmentSource.BOTPRESS,
      },

      include: {
        client: true,
        professional: true,
        specialty: true,
        service: true,
      },
    });
  },

  async update(
    id: string,
    data: UpdateAppointmentData
  ) {
    return prisma.appointment.update({
      where: { id },
      data,

      include: {
        client: true,
        professional: true,
        specialty: true,
        service: true,
      },
    });
  },

  async cancel(id: string) {
    return prisma.appointment.update({
      where: { id },

      data: {
        status: AppointmentStatus.CANCELLED,
      },
    });
  },
};