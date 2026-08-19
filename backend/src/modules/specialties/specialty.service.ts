import prisma from "../../lib/prisma";

export async function findAll() {
  return prisma.specialties.findMany({ where: { active: true } });
}

export async function findById(id: string) {
  return prisma.specialties.findUnique({ where: { id } });
}

export async function create(data: { name: string; description?: string }) {
  return prisma.specialties.create({ data });
}

export async function update(
  id: string,
  data: { name?: string; description?: string; active?: boolean }
) {
  return prisma.specialties.update({ where: { id }, data });
}

export async function deactivate(id: string) {
  return prisma.specialties.update({
    where: { id },
    data: { active: false },
  });
}
