import { prisma } from "../../lib/prisma";
import {
  DayOfWeek,
  ScheduleType,
} from "../../generated/prisma/enums";

interface CreateScheduleData {
  professionalId: string;

  specialtyId?: string | null;
  serviceId?: string | null;

  type: ScheduleType;

  dayOfWeek?: DayOfWeek | null;

  startTime?: string | null;
  endTime?: string | null;

  notes?: string | null;
}

interface UpdateScheduleData {
  professionalId?: string;

  specialtyId?: string | null;
  serviceId?: string | null;

  type?: ScheduleType;

  dayOfWeek?: DayOfWeek | null;

  startTime?: string | null;
  endTime?: string | null;

  notes?: string | null;
}

export const scheduleService = {
  async getAll() {
    return prisma.schedule.findMany({
      include: {
        professional: true,
        specialty: true,
        service: true,
      },

      orderBy: {
        dayOfWeek: "asc",
      },
    });
  },

  async getById(id: string) {
    return prisma.schedule.findUnique({
      where: {
        id,
      },

      include: {
        professional: true,
        specialty: true,
        service: true,
      },
    });
  },

  async getByProfessional(professionalId: string) {
    return prisma.schedule.findMany({
      where: {
        professionalId,
      },

      include: {
        specialty: true,
        service: true,
      },
    });
  },

  async create(data: CreateScheduleData) {
    return prisma.schedule.create({
      data,
      include: {
        professional: true,
        specialty: true,
        service: true,
      },
    });
  },

  async update(id: string, data: UpdateScheduleData) {
    return prisma.schedule.update({
      where: {
        id,
      },

      data,

      include: {
        professional: true,
        specialty: true,
        service: true,
      },
    });
  },

  async remove(id: string) {
    return prisma.schedule.delete({
      where: {
        id,
      },
    });
  },
};