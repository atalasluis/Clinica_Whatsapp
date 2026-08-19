import prisma from "../../lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "annie-ai-jwt-secret-2026";

export async function login(email: string, password: string) {
  const user = await prisma.admin_users.findUnique({ where: { email } });
  if (!user) throw new Error("Credenciales inválidas");
  if (!user.active) throw new Error("Usuario desactivado");
  
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new Error("Credenciales inválidas");
  
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: "24h" }
  );
  
  return {
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  };
}

export async function register(data: { name: string; email: string; password: string; role?: string }) {
  const existing = await prisma.admin_users.findUnique({ where: { email: data.email } });
  if (existing) throw new Error("El email ya está registrado");
  
  const hash = await bcrypt.hash(data.password, 10);
  const user = await prisma.admin_users.create({
    data: {
      name: data.name,
      email: data.email,
      passwordHash: hash,
      role: (data.role as any) || "RECEPTIONIST",
    },
  });
  
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: "24h" }
  );
  
  return {
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  };
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string; name: string };
}

export async function getProfile(userId: string) {
  const user = await prisma.admin_users.findUnique({ where: { id: userId } });
  if (!user) throw new Error("Usuario no encontrado");
  return { id: user.id, name: user.name, email: user.email, role: user.role, active: user.active };
}

export async function findAll() {
  return prisma.admin_users.findMany({
    select: { id: true, name: true, email: true, role: true, active: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
}
