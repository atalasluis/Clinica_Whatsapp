import prisma from "../../lib/prisma";
import { ScheduleType, DayOfWeek } from "../../generated/prisma/client";

export async function findAll() {
  return prisma.schedules.findMany({
    include: { professionals: true, specialties: true, services: true },
  });
}

export async function findById(id: string) {
  return prisma.schedules.findUnique({
    where: { id },
    include: { professionals: true, specialties: true, services: true },
  });
}

export async function findByProfessional(professionalId: string) {
  return prisma.schedules.findMany({
    where: { professionalId },
    include: { specialties: true, services: true },
  });
}

export async function create(data: {
  professionalId: string;
  specialtyId?: string;
  serviceId?: string;
  type: ScheduleType;
  dayOfWeek?: DayOfWeek;
  startTime?: string;
  endTime?: string;
  notes?: string;
}) {
  return prisma.schedules.create({ data });
}

export async function update(
  id: string,
  data: {
    type?: ScheduleType;
    dayOfWeek?: DayOfWeek;
    startTime?: string;
    endTime?: string;
    notes?: string;
    active?: boolean;
  }
) {
  return prisma.schedules.update({ where: { id }, data });
}

export async function remove(id: string) {
  return prisma.schedules.delete({ where: { id } });
}
