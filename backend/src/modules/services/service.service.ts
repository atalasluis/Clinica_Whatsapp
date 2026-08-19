import prisma from "../../lib/prisma";
import { ServiceCategory } from "../../generated/prisma/client";

export async function findAll() {
  return prisma.services.findMany({ where: { active: true } });
}

export async function findById(id: string) {
  return prisma.services.findUnique({ where: { id } });
}

export async function create(data: {
  name: string;
  description?: string;
  category: ServiceCategory;
  price?: number;
  currency?: string;
}) {
  return prisma.services.create({ data });
}

export async function update(
  id: string,
  data: {
    name?: string;
    description?: string;
    category?: ServiceCategory;
    price?: number;
    currency?: string;
    active?: boolean;
  }
) {
  return prisma.services.update({ where: { id }, data });
}

export async function deactivate(id: string) {
  return prisma.services.update({ where: { id }, data: { active: false } });
}
