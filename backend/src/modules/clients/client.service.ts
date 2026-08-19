import prisma from "../../lib/prisma";

export async function findAll() {
  return prisma.clients.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function findById(id: string) {
  return prisma.clients.findUnique({ where: { id } });
}

export async function findByPhone(phone: string) {
  return prisma.clients.findUnique({ where: { phone } });
}

export async function create(data: {
  firstName?: string;
  lastName?: string;
  phone: string;
  email?: string;
}) {
  return prisma.clients.create({ data });
}

export async function update(
  id: string,
  data: {
    firstName?: string;
    lastName?: string;
    email?: string;
  }
) {
  return prisma.clients.update({ where: { id }, data });
}
