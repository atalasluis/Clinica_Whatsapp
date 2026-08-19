import prisma from "../../lib/prisma";

export async function findAll() {
  return prisma.professionals.findMany({
    where: { active: true },
    include: {
      professional_specialties: { include: { specialties: true } },
      professional_services: { include: { services: true } },
      schedules: true,
    },
  });
}

export async function findById(id: string) {
  return prisma.professionals.findUnique({
    where: { id },
    include: {
      professional_specialties: { include: { specialties: true } },
      professional_services: { include: { services: true } },
      schedules: true,
    },
  });
}

export async function create(data: {
  firstName: string;
  lastName?: string;
  title?: string;
}) {
  return prisma.professionals.create({ data });
}

export async function update(
  id: string,
  data: {
    firstName?: string;
    lastName?: string;
    title?: string;
    active?: boolean;
  }
) {
  return prisma.professionals.update({ where: { id }, data });
}

export async function deactivate(id: string) {
  return prisma.professionals.update({
    where: { id },
    data: { active: false },
  });
}
