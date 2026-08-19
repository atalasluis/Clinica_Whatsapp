import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcryptjs";
import {
  PrismaClient, ServiceCategory, ScheduleType, DayOfWeek, AdminRole,
  ConversationStatus, MessageSender, MessageType,
  LeadStatus, AppointmentStatus, AppointmentSource,
} from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const MF = [DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY, DayOfWeek.THURSDAY, DayOfWeek.FRIDAY];
const MFS = [...MF, DayOfWeek.SATURDAY];
const MFSu = [...MFS, DayOfWeek.SUNDAY];

function sched(profId: string, specId: string | null, days: DayOfWeek[], start: string, end: string) {
  return days.map(day => ({
    professionalId: profId, specialtyId: specId, serviceId: null,
    type: ScheduleType.FIXED, dayOfWeek: day, startTime: start, endTime: end, notes: null,
  }));
}

async function main() {
  console.log("Iniciando seed de Centro de Especialidades Annie Atai...");

  // ─── Limpieza ─────────────────────────────────────────────
  await prisma.messages.deleteMany();
  await prisma.leads.deleteMany();
  await prisma.appointments.deleteMany();
  await prisma.conversations.deleteMany();
  await prisma.clients.deleteMany();
  await prisma.schedules.deleteMany();
  await prisma.professional_specialties.deleteMany();
  await prisma.professionals.deleteMany();
  await prisma.services.deleteMany();
  await prisma.specialties.deleteMany();
  await prisma.admin_users.deleteMany();
  console.log("✔ Base de datos limpiada");

  // ═══════════════════════════════════════════════════════════
  // 1. ESPECIALIDADES (26)
  // ═══════════════════════════════════════════════════════════
  const specialtiesNames = [
    "Medicina General", "Medicina Familiar", "Medicina Interna", "Medicina Aeronáutica",
    "Cardiología", "Endocrinología", "Gastroenterología", "Neumología", "Neurología",
    "Reumatología", "Dermatología", "Ginecología", "Pediatría", "Pediatría Hematología",
    "Pediatría Infectología", "Cirugía", "Traumatología", "Urología", "Otorrinolaringología",
    "Medicina Estética", "Medicina Alternativa", "Podología", "Psiquiatría", "Psicología",
    "Fonoaudiología", "Nutrición",
  ];

  const specialties: { id: string; name: string }[] = [];
  for (const name of specialtiesNames) {
    const s = await prisma.specialties.upsert({ where: { name }, update: {}, create: { name } });
    specialties.push(s);
  }
  console.log(`✔ ${specialties.length} especialidades creadas`);

  const findSpec = (name: string) => specialties.find(s => s.name === name)?.id ?? null;

  // ═══════════════════════════════════════════════════════════
  // 2. SERVICIOS
  // ═══════════════════════════════════════════════════════════
  const servicesData = [
    // ── Ecografías Generales ──
    { name: "Ecografía Abdominal", category: ServiceCategory.DIAGNOSTIC, price: 220 },
    { name: "Ecografía Renal y Vías Urinarias", category: ServiceCategory.DIAGNOSTIC, price: 220 },
    { name: "Ecografía de Próstata", category: ServiceCategory.DIAGNOSTIC, price: 200 },
    { name: "Ecografía Renal, Vías Urinarias y Próstata", category: ServiceCategory.DIAGNOSTIC, price: 320 },
    { name: "Ecografía Pélvica", category: ServiceCategory.DIAGNOSTIC, price: 220 },
    { name: "Ecografía Transvaginal", category: ServiceCategory.DIAGNOSTIC, price: 220 },
    // ── Ecografías Obstétricas ──
    { name: "Ecografía Obstétrica General", category: ServiceCategory.DIAGNOSTIC, price: 220 },
    { name: "Ecografía Obstétrica Inicial", category: ServiceCategory.DIAGNOSTIC, price: 220 },
    { name: "Ecografía Obstétrica Cromosómica (11-14 sem)", category: ServiceCategory.DIAGNOSTIC, price: 350 },
    { name: "Ecografía Obstétrica Morfológica", category: ServiceCategory.DIAGNOSTIC, price: 350 },
    { name: "Doppler Obstétrica Materno-Fetal", category: ServiceCategory.DIAGNOSTIC, price: 500 },
    { name: "Perfil Biofísico", category: ServiceCategory.DIAGNOSTIC, price: 220 },
    { name: "Doppler Placentario", category: ServiceCategory.DIAGNOSTIC, price: 250 },
    // ── Ecografías Especializadas ──
    { name: "Ecografía Mamaria", category: ServiceCategory.DIAGNOSTIC, price: 250 },
    { name: "Ecografía de Tiroides", category: ServiceCategory.DIAGNOSTIC, price: 220 },
    { name: "Ecografía de Tiroides y Cuello", category: ServiceCategory.DIAGNOSTIC, price: 300 },
    { name: "Ecografía Testicular", category: ServiceCategory.DIAGNOSTIC, price: 280 },
    { name: "Ecografía de Partes Blandas", category: ServiceCategory.DIAGNOSTIC, price: 250 },
    // ── Ecografías Musculoesqueléticas ──
    { name: "Ecografía Hombro Unilateral", category: ServiceCategory.DIAGNOSTIC, price: 220 },
    { name: "Ecografía Hombro Bilateral", category: ServiceCategory.DIAGNOSTIC, price: 310 },
    { name: "Ecografía Rodilla Unilateral", category: ServiceCategory.DIAGNOSTIC, price: 220 },
    { name: "Ecografía Rodilla Bilateral", category: ServiceCategory.DIAGNOSTIC, price: 310 },
    { name: "Ecografía Tobillo Unilateral", category: ServiceCategory.DIAGNOSTIC, price: 260 },
    { name: "Ecografía Tobillo Bilateral", category: ServiceCategory.DIAGNOSTIC, price: 410 },
    { name: "Ecografía Codo Unilateral", category: ServiceCategory.DIAGNOSTIC, price: 260 },
    { name: "Ecografía Codo Bilateral", category: ServiceCategory.DIAGNOSTIC, price: 410 },
    { name: "Ecografía Muñeca Unilateral", category: ServiceCategory.DIAGNOSTIC, price: 260 },
    { name: "Ecografía Muñeca Bilateral", category: ServiceCategory.DIAGNOSTIC, price: 410 },
    // ── Doppler ──
    { name: "Doppler Testicular", category: ServiceCategory.DIAGNOSTIC, price: 350 },
    { name: "Doppler Miembros Inferiores Venoso Unilateral", category: ServiceCategory.DIAGNOSTIC, price: 450 },
    { name: "Doppler Miembros Inferiores Venoso Bilateral", category: ServiceCategory.DIAGNOSTIC, price: 900 },
    { name: "Doppler Arterial Unilateral", category: ServiceCategory.DIAGNOSTIC, price: 450 },
    { name: "Doppler Arterial Bilateral", category: ServiceCategory.DIAGNOSTIC, price: 900 },
    // ── Otros servicios diagnósticos ──
    { name: "Laboratorio Clínico", category: ServiceCategory.DIAGNOSTIC, price: null },
    { name: "UNIMAGEN", category: ServiceCategory.DIAGNOSTIC, price: null },
    // ── Otros ──
    { name: "Enfermería", category: ServiceCategory.OTHER, price: null },
    { name: "Servicio de Ambulancia", category: ServiceCategory.OTHER, price: null },
    // ── Rehabilitación ──
    { name: "Fisioterapia y Kinesiología", category: ServiceCategory.REHABILITATION, price: null },
    // ── Complementarios ──
    { name: "Ozonoterapia", category: ServiceCategory.COMPLEMENTARY, price: null },
    { name: "Plasma Rico en Plaquetas (PRP)", category: ServiceCategory.COMPLEMENTARY, price: null },
  ];

  const services: { id: string; name: string }[] = [];
  for (const s of servicesData) {
    const result = await prisma.services.upsert({
      where: { name: s.name },
      update: { price: s.price, category: s.category, currency: "BOB" },
      create: { name: s.name, category: s.category, price: s.price, currency: "BOB" },
    });
    services.push(result);
  }
  console.log(`✔ ${services.length} servicios creados`);

  // ═══════════════════════════════════════════════════════════
  // 3. PROFESIONALES (33)
  // ═══════════════════════════════════════════════════════════
  const profData = [
    // Medicina General - Turno tarde
    { firstName: "Gisela", lastName: "Cayo", title: "Dra." },
    { firstName: "Revollo", lastName: null, title: "Dr." },
    { firstName: "Jorge", lastName: "Limachi", title: "Dr." },
    // Medicina General - Turno mañana
    { firstName: "Alison", lastName: "Flores Rocha", title: "Dra." },
    { firstName: "Ingrid", lastName: "Medrano", title: "Dra." },
    // Cardiología
    { firstName: "Carlos", lastName: "López López", title: "Dr." },
    { firstName: "Edgar", lastName: "López López", title: "Dr." },
    // Otorrinolaringología
    { firstName: "Jorge", lastName: "Medina", title: "Dr." },
    // Endocrinología
    { firstName: "Ana", lastName: "Angulo", title: "Dra." },
    // Dermatología
    { firstName: "Magnoil", lastName: "Vacadiez", title: "Dr." },
    // Gastroenterología
    { firstName: "Osmar", lastName: "Oporto Pérez", title: "Dr." },
    // Ginecología
    { firstName: "Daneliz", lastName: "Ala", title: "Dra." },
    // Ecografía
    { firstName: "Marisol", lastName: null, title: "Dr." },
    // Pediatría Hematología
    { firstName: "Ventura", lastName: "Quintana Henry Cristian", title: "Dr." },
    // Pediatría Infectología
    { firstName: "Kenia", lastName: "Castro", title: "Dra." },
    // Pediatría
    { firstName: "Elizabeth", lastName: "Rivero", title: "Dra." },
    // Traumatología
    { firstName: "Gustavo", lastName: "Balderrama Uriona", title: "Dr." },
    // Urología
    { firstName: "Daniel", lastName: "Ayala Careaga", title: "Dr." },
    // Reumatología
    { firstName: "Mónica", lastName: "Cuellar Arnez", title: "Dra." },
    // Nutrición
    { firstName: "Jessica", lastName: "Herbas", title: "Lic." },
    // Neumología
    { firstName: "Miguel", lastName: "Palenque", title: "Dr." },
    // Fisioterapia
    { firstName: "Paola", lastName: "Aguila Abud", title: "Lic." },
    // Psicología
    { firstName: "Adelina Claudia", lastName: "Vasques Vallejos", title: "Lic." },
    // Psiquiatría
    { firstName: "Soraire", lastName: "Baldivieso Jeaneth", title: "Dra." },
    { firstName: "Ernesto", lastName: "Málaga", title: "Dr." },
    { firstName: "Luana", lastName: "Rodrigues", title: "Dra." },
    // Fonoaudiología
    { firstName: "Ninoska", lastName: "Zuna", title: "Lic." },
    // Medicina Interna
    { firstName: "José Luis", lastName: "Vargas", title: "Dr." },
    // UNIMAGEN
    { firstName: "Mónica", lastName: "Schnurpfeil", title: "Lic." },
    // Enfermería
    { firstName: "Valeria", lastName: "Flores", title: "Lic." },
    { firstName: "Helen", lastName: "Teran", title: "Lic." },
    { firstName: "Rocio", lastName: "Arroyo", title: "Lic." },
    { firstName: "Estefania", lastName: "Lopez", title: null },
  ];

  const professionals: { id: string; firstName: string; lastName?: string | null }[] = [];
  for (const p of profData) {
    const result = await prisma.professionals.create({ data: p });
    professionals.push(result);
  }
  console.log(`✔ ${professionals.length} profesionales creados`);

  // ═══════════════════════════════════════════════════════════
  // 4. RELACIONES PROFESIONAL-ESPECIALIDAD
  // ═══════════════════════════════════════════════════════════
  const p = (idx: number) => professionals[idx].id;

  const profSpecEntries = [
    // Medicina General (0-4)
    { professionalId: p(0), specialtyId: findSpec("Medicina General")! },
    { professionalId: p(1), specialtyId: findSpec("Medicina General")! },
    { professionalId: p(2), specialtyId: findSpec("Medicina General")! },
    { professionalId: p(3), specialtyId: findSpec("Medicina General")! },
    { professionalId: p(4), specialtyId: findSpec("Medicina General")! },
    // Cardiología (5-6)
    { professionalId: p(5), specialtyId: findSpec("Cardiología")! },
    { professionalId: p(6), specialtyId: findSpec("Cardiología")! },
    // Otorrinolaringología (7)
    { professionalId: p(7), specialtyId: findSpec("Otorrinolaringología")! },
    // Endocrinología (8)
    { professionalId: p(8), specialtyId: findSpec("Endocrinología")! },
    // Dermatología (9)
    { professionalId: p(9), specialtyId: findSpec("Dermatología")! },
    // Gastroenterología (10)
    { professionalId: p(10), specialtyId: findSpec("Gastroenterología")! },
    // Ginecología (11)
    { professionalId: p(11), specialtyId: findSpec("Ginecología")! },
    // Pediatría Hematología (13)
    { professionalId: p(13), specialtyId: findSpec("Pediatría Hematología")! },
    // Pediatría Infectología (14)
    { professionalId: p(14), specialtyId: findSpec("Pediatría Infectología")! },
    // Pediatría (15)
    { professionalId: p(15), specialtyId: findSpec("Pediatría")! },
    // Traumatología (16)
    { professionalId: p(16), specialtyId: findSpec("Traumatología")! },
    // Urología (17)
    { professionalId: p(17), specialtyId: findSpec("Urología")! },
    // Reumatología (18)
    { professionalId: p(18), specialtyId: findSpec("Reumatología")! },
    // Nutrición (19)
    { professionalId: p(19), specialtyId: findSpec("Nutrición")! },
    // Neumología (20)
    { professionalId: p(20), specialtyId: findSpec("Neumología")! },
    // Fisioterapia (21) - Sin especialidad médica en el catálogo, se omite vínculo
    // Psicología (22)
    { professionalId: p(22), specialtyId: findSpec("Psicología")! },
    // Psiquiatría (23-25)
    { professionalId: p(23), specialtyId: findSpec("Psiquiatría")! },
    { professionalId: p(24), specialtyId: findSpec("Psiquiatría")! },
    { professionalId: p(25), specialtyId: findSpec("Psiquiatría")! },
    // Fonoaudiología (26)
    { professionalId: p(26), specialtyId: findSpec("Fonoaudiología")! },
    // Medicina Interna (27)
    { professionalId: p(27), specialtyId: findSpec("Medicina Interna")! },
  ];

  for (const ps of profSpecEntries) {
    await prisma.professional_specialties.upsert({
      where: { professionalId_specialtyId: ps },
      update: {},
      create: ps,
    }).catch(() => {});
  }
  console.log(`✔ ${profSpecEntries.length} relaciones profesional-especialidad creadas`);

  // ═══════════════════════════════════════════════════════════
  // 5. HORARIOS
  // ═══════════════════════════════════════════════════════════
  const allSchedules: any[] = [];
  const cardioSpecId = findSpec("Cardiología");
  const medGenSpecId = findSpec("Medicina General");
  const otorrSpecId = findSpec("Otorrinolaringología");
  const endocrineSpecId = findSpec("Endocrinología");
  const dermaSpecId = findSpec("Dermatología");
  const gastroSpecId = findSpec("Gastroenterología");
  const ginecoSpecId = findSpec("Ginecología");
  const pedHematSpecId = findSpec("Pediatría Hematología");
  const pedInfSpecId = findSpec("Pediatría Infectología");
  const pedSpecId = findSpec("Pediatría");
  const traumaSpecId = findSpec("Traumatología");
  const uroSpecId = findSpec("Urología");
  const reumaSpecId = findSpec("Reumatología");
  const nutriSpecId = findSpec("Nutrición");
  const neumoSpecId = findSpec("Neumología");
  const fisioSpecId = findSpec("Fonoaudiología");
  const psicoSpecId = findSpec("Psicología");
  const psiqSpecId = findSpec("Psiquiatría");
  const fonoSpecId = findSpec("Fonoaudiología");
  const medIntSpecId = findSpec("Medicina Interna");

  // Dra. Gisela Cayo - Medicina General (tarde)
  allSchedules.push(...sched(p(0), medGenSpecId, MF, "14:00", "20:00"));
  allSchedules.push({ professionalId: p(0), specialtyId: medGenSpecId, serviceId: null, type: ScheduleType.FIXED, dayOfWeek: DayOfWeek.SATURDAY, startTime: "09:00", endTime: "12:00", notes: null });
  allSchedules.push({ professionalId: p(0), specialtyId: medGenSpecId, serviceId: null, type: ScheduleType.FIXED, dayOfWeek: DayOfWeek.SUNDAY, startTime: "08:00", endTime: "15:00", notes: null });

  // Dr. Revollo - Medicina General (tarde)
  allSchedules.push(...sched(p(1), medGenSpecId, MF, "14:00", "20:00"));
  allSchedules.push({ professionalId: p(1), specialtyId: medGenSpecId, serviceId: null, type: ScheduleType.FIXED, dayOfWeek: DayOfWeek.SATURDAY, startTime: "09:00", endTime: "12:00", notes: null });
  allSchedules.push({ professionalId: p(1), specialtyId: medGenSpecId, serviceId: null, type: ScheduleType.FIXED, dayOfWeek: DayOfWeek.SUNDAY, startTime: "08:00", endTime: "15:00", notes: null });

  // Dr. Jorge Limachi - Medicina General (tarde)
  allSchedules.push(...sched(p(2), medGenSpecId, MF, "14:00", "20:00"));
  allSchedules.push({ professionalId: p(2), specialtyId: medGenSpecId, serviceId: null, type: ScheduleType.FIXED, dayOfWeek: DayOfWeek.SATURDAY, startTime: "09:00", endTime: "12:00", notes: null });
  allSchedules.push({ professionalId: p(2), specialtyId: medGenSpecId, serviceId: null, type: ScheduleType.FIXED, dayOfWeek: DayOfWeek.SUNDAY, startTime: "08:00", endTime: "15:00", notes: null });

  // Dra. Alison Flores Rocha - Medicina General (mañana)
  allSchedules.push(...sched(p(3), medGenSpecId, MF, "08:00", "14:00"));
  allSchedules.push({ professionalId: p(3), specialtyId: medGenSpecId, serviceId: null, type: ScheduleType.FIXED, dayOfWeek: DayOfWeek.SATURDAY, startTime: "14:00", endTime: "18:00", notes: null });
  allSchedules.push({ professionalId: p(3), specialtyId: medGenSpecId, serviceId: null, type: ScheduleType.FIXED, dayOfWeek: DayOfWeek.SUNDAY, startTime: "08:00", endTime: "15:00", notes: null });

  // Dra. Ingrid Medrano - Medicina General (mañana)
  allSchedules.push(...sched(p(4), medGenSpecId, MF, "08:00", "14:00"));
  allSchedules.push({ professionalId: p(4), specialtyId: medGenSpecId, serviceId: null, type: ScheduleType.FIXED, dayOfWeek: DayOfWeek.SATURDAY, startTime: "14:00", endTime: "18:00", notes: null });
  allSchedules.push({ professionalId: p(4), specialtyId: medGenSpecId, serviceId: null, type: ScheduleType.FIXED, dayOfWeek: DayOfWeek.SUNDAY, startTime: "08:00", endTime: "15:00", notes: null });

  // Dr. Carlos López López - Cardiología
  allSchedules.push(...sched(p(5), cardioSpecId, MF, "14:00", "18:00"));
  allSchedules.push({ professionalId: p(5), specialtyId: cardioSpecId, serviceId: null, type: ScheduleType.ON_CALL, dayOfWeek: null, startTime: null, endTime: null, notes: "Emergencias cardíacas a llamado" });

  // Dr. Edgar López López - Cardiología
  allSchedules.push(...sched(p(6), cardioSpecId, MF, "14:00", "18:00"));
  allSchedules.push({ professionalId: p(6), specialtyId: cardioSpecId, serviceId: null, type: ScheduleType.ON_CALL, dayOfWeek: null, startTime: null, endTime: null, notes: "Emergencias cardíacas a llamado" });

  // Dr. Jorge Medina - Otorrinolaringología
  allSchedules.push({ professionalId: p(7), specialtyId: otorrSpecId, serviceId: null, type: ScheduleType.FIXED, dayOfWeek: DayOfWeek.TUESDAY, startTime: "09:00", endTime: "12:00", notes: null });
  allSchedules.push({ professionalId: p(7), specialtyId: otorrSpecId, serviceId: null, type: ScheduleType.FIXED, dayOfWeek: DayOfWeek.THURSDAY, startTime: "15:00", endTime: "18:00", notes: null });
  allSchedules.push({ professionalId: p(7), specialtyId: otorrSpecId, serviceId: null, type: ScheduleType.ON_CALL, dayOfWeek: null, startTime: null, endTime: null, notes: "Domingos y feriados a llamado" });

  // Dra. Ana Angulo - Endocrinología
  allSchedules.push({ professionalId: p(8), specialtyId: endocrineSpecId, serviceId: null, type: ScheduleType.ON_CALL, dayOfWeek: null, startTime: null, endTime: null, notes: "Lunes a viernes a llamado" });

  // Dr. Magnoil Vacadiez - Dermatología
  allSchedules.push(...sched(p(9), dermaSpecId, MF, "17:00", "19:00"));
  allSchedules.push({ professionalId: p(9), specialtyId: dermaSpecId, serviceId: null, type: ScheduleType.ON_CALL, dayOfWeek: null, startTime: null, endTime: null, notes: "A llamado fuera de horario" });

  // Dr. Osmar Oporto Pérez - Gastroenterología
  allSchedules.push({ professionalId: p(10), specialtyId: gastroSpecId, serviceId: null, type: ScheduleType.FIXED, dayOfWeek: DayOfWeek.MONDAY, startTime: "17:00", endTime: "20:00", notes: null });
  allSchedules.push({ professionalId: p(10), specialtyId: gastroSpecId, serviceId: null, type: ScheduleType.FIXED, dayOfWeek: DayOfWeek.FRIDAY, startTime: "15:00", endTime: "18:00", notes: null });

  // Dra. Daneliz Ala - Ginecología
  allSchedules.push(...sched(p(11), ginecoSpecId, MF, "12:30", "21:00"));

  // Dr. Marisol - Ecografía
  allSchedules.push(...sched(p(12), null, MF, "08:00", "10:00"));
  allSchedules.push(...sched(p(12), null, MF, "15:00", "19:00"));

  // Dr. Ventura Quintana - Pediatría Hematología
  allSchedules.push(...sched(p(13), pedHematSpecId, MF, "14:00", "16:00"));

  // Dra. Kenia Castro - Pediatría Infectología
  allSchedules.push({ professionalId: p(14), specialtyId: pedInfSpecId, serviceId: null, type: ScheduleType.TO_COORDINATE, dayOfWeek: null, startTime: null, endTime: null, notes: "Horarios a coordinar" });

  // Dra. Elizabeth Rivero - Pediatría
  allSchedules.push({ professionalId: p(15), specialtyId: pedSpecId, serviceId: null, type: ScheduleType.TO_COORDINATE, dayOfWeek: null, startTime: null, endTime: null, notes: "Horarios a coordinar" });

  // Dr. Gustavo Balderrama Uriona - Traumatología
  allSchedules.push(...sched(p(16), traumaSpecId, MF, "18:00", "20:00"));

  // Dr. Daniel Ayala Careaga - Urología
  allSchedules.push(...sched(p(17), uroSpecId, MF, "12:00", "14:00"));

  // Dra. Mónica Cuellar Arnez - Reumatología
  allSchedules.push(...sched(p(18), reumaSpecId, MF, "18:30", "20:00"));

  // Lic. Jessica Herbas - Nutrición
  allSchedules.push(...sched(p(19), nutriSpecId, MF, "14:00", "18:00"));

  // Dr. Miguel Palenque - Neumología
  allSchedules.push(...sched(p(20), neumoSpecId, MF, "18:00", "20:00"));

  // Lic. Paola Aguila Abud - Fisioterapia
  allSchedules.push(...sched(p(21), fisioSpecId, MF, "08:00", "18:00"));

  // Lic. Adelina Claudia Vasques Vallejos - Psicología
  allSchedules.push({ professionalId: p(22), specialtyId: psicoSpecId, serviceId: null, type: ScheduleType.TO_COORDINATE, dayOfWeek: null, startTime: null, endTime: null, notes: "Horarios a coordinar" });

  // Dra. Soraire Baldivieso Jeaneth - Psiquiatría
  allSchedules.push(...sched(p(23), psiqSpecId, MF, "13:00", "20:00"));

  // Dr. Ernesto Málaga - Psiquiatría
  allSchedules.push(...sched(p(24), psiqSpecId, MF, "14:00", "16:00"));

  // Dra. Luana Rodrigues - Psiquiatría
  allSchedules.push(...sched(p(25), psiqSpecId, MF, "08:00", "12:00"));

  // Lic. Ninoska Zuna - Fonoaudiología
  allSchedules.push({ professionalId: p(26), specialtyId: fonoSpecId, serviceId: null, type: ScheduleType.TO_COORDINATE, dayOfWeek: null, startTime: null, endTime: null, notes: "Horarios a coordinar" });

  // Dr. José Luis Vargas - Medicina Interna
  allSchedules.push({ professionalId: p(27), specialtyId: medIntSpecId, serviceId: null, type: ScheduleType.TO_COORDINATE, dayOfWeek: null, startTime: null, endTime: null, notes: "Horarios a coordinar" });

  // Lic. Mónica Schnurpfeil - UNIMAGEN
  allSchedules.push({ professionalId: p(28), specialtyId: null, serviceId: null, type: ScheduleType.TO_COORDINATE, dayOfWeek: null, startTime: null, endTime: null, notes: "Horarios a coordinar - UNIMAGEN" });

  // Enfermería - Lic. Valeria Flores (emergencias)
  allSchedules.push({ professionalId: p(29), specialtyId: null, serviceId: null, type: ScheduleType.EMERGENCY, dayOfWeek: null, startTime: null, endTime: null, notes: "Lunes a domingo - Emergencias 24h" });

  // Enfermería - Lic. Helen Teran (emergencias)
  allSchedules.push({ professionalId: p(30), specialtyId: null, serviceId: null, type: ScheduleType.EMERGENCY, dayOfWeek: null, startTime: null, endTime: null, notes: "Lunes a domingo - Emergencias 24h" });

  // Enfermería - Lic. Rocio Arroyo
  allSchedules.push(...sched(p(31), null, MFSu, "08:00", "20:00"));

  // Enfermería - Estefania Lopez
  allSchedules.push(...sched(p(32), null, MFSu, "08:00", "20:00"));

  for (const s of allSchedules) {
    await prisma.schedules.create({ data: s });
  }
  console.log(`✔ ${allSchedules.length} horarios creados`);

  // ═══════════════════════════════════════════════════════════
  // 6. USUARIOS ADMINISTRATIVOS
  // ═══════════════════════════════════════════════════════════
  const adminPassword = await bcrypt.hash("admin123", 10);

  const adminUsersData = [
    { name: "María Elena Vargas", email: "maria.vargas@annieatai.com", passwordHash: adminPassword, role: AdminRole.ADMIN },
    { name: "Carlos Mendoza Ríos", email: "carlos.mendoza@annieatai.com", passwordHash: adminPassword, role: AdminRole.ADMIN },
    { name: "Ana Lucía Gutiérrez", email: "ana.gutierrez@annieatai.com", passwordHash: adminPassword, role: AdminRole.RECEPTIONIST },
    { name: "Patricia Flores Martínez", email: "patricia.flores@annieatai.com", passwordHash: adminPassword, role: AdminRole.RECEPTIONIST },
    { name: "Rocío Jiménez Peña", email: "rocio.jimenez@annieatai.com", passwordHash: adminPassword, role: AdminRole.RECEPTIONIST },
    { name: "Sandra Bolivia Torres", email: "sandra.torres@annieatai.com", passwordHash: adminPassword, role: AdminRole.RECEPTIONIST },
    { name: "Dr. Luis Fernando Paredes", email: "luis.paredes@annieatai.com", passwordHash: adminPassword, role: AdminRole.DOCTOR },
    { name: "Dra. Claudia Beatriz Soliz", email: "claudia.soliz@annieatai.com", passwordHash: adminPassword, role: AdminRole.DOCTOR },
    { name: "Dr. Fernando Arancibia Lopez", email: "fernando.arancibia@annieatai.com", passwordHash: adminPassword, role: AdminRole.DOCTOR },
    { name: "Dra. Gabriela Mercado Viera", email: "gabriela.mercado@annieatai.com", passwordHash: adminPassword, role: AdminRole.DOCTOR },
  ];

  for (const user of adminUsersData) {
    await prisma.admin_users.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
  }
  console.log(`✔ ${adminUsersData.length} usuarios administrativos creados`);

  // ═══════════════════════════════════════════════════════════
  // 7. CLIENTES (pacientes)
  // ═══════════════════════════════════════════════════════════
  const clientsData = [
    { firstName: "Juan", lastName: "Pérez Condori", phone: "59170123456", email: "juan.perez@gmail.com" },
    { firstName: "María", lastName: "López de García", phone: "59170234567", email: "maria.lopez@hotmail.com" },
    { firstName: "Carlos", lastName: "Mamani Quispe", phone: "59170345678", email: null },
    { firstName: "Ana", lastName: "Torres Vargas", phone: "59170456789", email: "ana.torres@gmail.com" },
    { firstName: "Luis", lastName: "Gutiérrez Mendoza", phone: "59170567890", email: null },
    { firstName: "Gabriela", lastName: "Rojas Fernández", phone: "59170678901", email: "gabriela.rojas@outlook.com" },
    { firstName: "Pedro", lastName: "Huanca Flores", phone: "59170789012", email: null },
    { firstName: "Rocío", lastName: "Castellón Bautista", phone: "59170890123", email: "rocio.castellon@gmail.com" },
    { firstName: "Fernando", lastName: "Vargas Paredes", phone: "59170901234", email: null },
    { firstName: "Claudia", lastName: "Medina Soruco", phone: "59171012345", email: "claudia.medina@yahoo.com" },
    { firstName: "Jorge", lastName: "Cáceres Ríos", phone: "59171123456", email: null },
    { firstName: "Patricia", lastName: "Quispe Terrazas", phone: "59171234567", email: "patricia.quispe@gmail.com" },
    { firstName: "Sandra", lastName: "Estrada Villca", phone: "59171345678", email: null },
    { firstName: "Roberto", lastName: "Apaza Nina", phone: "59171456789", email: "roberto.apaza@hotmail.com" },
    { firstName: "Valeria", lastName: "Choque Callisaya", phone: "59171567890", email: null },
  ];

  const clients: { id: string; phone: string }[] = [];
  for (const c of clientsData) {
    const result = await prisma.clients.create({ data: c });
    clients.push(result);
  }
  console.log(`✔ ${clients.length} clientes creados`);

  // ═══════════════════════════════════════════════════════════
  // 8. CONVERSACIONES
  // ═══════════════════════════════════════════════════════════
  const [c1, c2, c3, c4, c5, c6, c7, c8, c9, c10] = clients;

  const conversationsData = [
    { clientId: c1.id, externalId: "bp_conv_001", status: ConversationStatus.OPEN },
    { clientId: c2.id, externalId: "bp_conv_002", status: ConversationStatus.CLOSED },
    { clientId: c3.id, externalId: "bp_conv_003", status: ConversationStatus.OPEN },
    { clientId: c4.id, externalId: "bp_conv_004", status: ConversationStatus.HUMAN_ATTENTION },
    { clientId: c5.id, externalId: "bp_conv_005", status: ConversationStatus.CLOSED },
    { clientId: c6.id, externalId: "bp_conv_006", status: ConversationStatus.OPEN },
    { clientId: c7.id, externalId: "bp_conv_007", status: ConversationStatus.CLOSED },
    { clientId: c8.id, externalId: "bp_conv_008", status: ConversationStatus.OPEN },
    { clientId: c9.id, externalId: "bp_conv_009", status: ConversationStatus.CLOSED },
    { clientId: c10.id, externalId: "bp_conv_010", status: ConversationStatus.CLOSED },
  ];

  const conversations: { id: string; clientId: string }[] = [];
  for (const c of conversationsData) {
    const result = await prisma.conversations.create({ data: c });
    conversations.push(result);
  }
  console.log(`✔ ${conversations.length} conversaciones creadas`);

  // ═══════════════════════════════════════════════════════════
  // 9. MENSAJES
  // ═══════════════════════════════════════════════════════════
  const [conv1, conv2, conv3, conv4, conv5, conv6, conv7, conv8] = conversations;

  const messagesData = [
    // Conv1 - Juan preguntando por cardiología
    { conversationId: conv1.id, sender: MessageSender.CLIENT, type: MessageType.TEXT, content: "Hola, buenas tardes. Quisiera saber si tienen cardiología disponible en el Annie Atai." },
    { conversationId: conv1.id, sender: MessageSender.BOT, type: MessageType.TEXT, content: "¡Buenas tardes! Sí, contamos con servicio de Cardiología con el Dr. Carlos López y Dr. Edgar López, de lunes a viernes de 14:00 a 18:00. ¿Desea agendar una cita?" },
    { conversationId: conv1.id, sender: MessageSender.CLIENT, type: MessageType.TEXT, content: "Sí, por favor. ¿Cuándo hay disponibilidad?" },
    { conversationId: conv1.id, sender: MessageSender.BOT, type: MessageType.TEXT, content: "Tenemos disponibilidad los lunes y jueves. ¿Le sirve alguno de esos días?" },

    // Conv2 - María - consulta pediátrica
    { conversationId: conv2.id, sender: MessageSender.CLIENT, type: MessageType.TEXT, content: "Buenos días, necesito una consulta pediátrica para mi hijo de 5 años." },
    { conversationId: conv2.id, sender: MessageSender.BOT, type: MessageType.TEXT, content: "¡Buenos días! Para Pediatría tenemos a la Dra. Elizabeth Rivero y la Dra. Kenia Castro. Los horarios se coordinan directamente. ¿Quiere agendar?" },
    { conversationId: conv2.id, sender: MessageSender.CLIENT, type: MessageType.TEXT, content: "Sí, el miércoles por la mañana estaría bien." },
    { conversationId: conv2.id, sender: MessageSender.BOT, type: MessageType.TEXT, content: "Perfecto, he agendado una cita para el miércoles a las 09:00 con la Dra. Elizabeth Rivero en Pediatría. ¡Que tenga un buen día!" },

    // Conv3 - Carlos - ecografía
    { conversationId: conv3.id, sender: MessageSender.CLIENT, type: MessageType.TEXT, content: "Hola, ¿cuánto cuesta una ecografía abdominal?" },
    { conversationId: conv3.id, sender: MessageSender.BOT, type: MessageType.TEXT, content: "La Ecografía Abdominal tiene un costo de Bs 220. El Dr. Marisol atiende de lunes a viernes de 08:00 a 10:00 y de 15:00 a 19:00. ¿Desea agendar?" },
    { conversationId: conv3.id, sender: MessageSender.CLIENT, type: MessageType.TEXT, content: "Sí, ¿tienen disponibilidad esta semana?" },

    // Conv4 - Ana - cancelar cita
    { conversationId: conv4.id, sender: MessageSender.CLIENT, type: MessageType.TEXT, content: "Quiero cancelar mi cita del viernes" },
    { conversationId: conv4.id, sender: MessageSender.BOT, type: MessageType.TEXT, content: "Lamento escuchar eso. Para cancelaciones, una persona de nuestro equipo la atenderá. Un momento por favor." },
    { conversationId: conv4.id, sender: MessageSender.STAFF, type: MessageType.TEXT, content: "Buenas tardes Ana, soy Patricia de recepción del Annie Atai. ¿Puede indicarme cuál es el motivo de la cancelación?" },

    // Conv5 - Luis - dermatología
    { conversationId: conv5.id, sender: MessageSender.CLIENT, type: MessageType.TEXT, content: "Hola, necesito una consulta de dermatología" },
    { conversationId: conv5.id, sender: MessageSender.BOT, type: MessageType.TEXT, content: "¡Claro! El Dr. Magnoil Vacadiez atiende Dermatología de lunes a viernes de 17:00 a 19:00 y también a llamado. ¿Desea agendar?" },
    { conversationId: conv5.id, sender: MessageSender.CLIENT, type: MessageType.TEXT, content: "Sí, agéndenla por favor." },

    // Conv6 - Gabriela - nutrición
    { conversationId: conv6.id, sender: MessageSender.CLIENT, type: MessageType.TEXT, content: "Buenas, quiero una consulta de nutrición" },
    { conversationId: conv6.id, sender: MessageSender.BOT, type: MessageType.TEXT, content: "Nuestro servicio de Nutrición está a cargo de la Lic. Jessica Herbas, de lunes a viernes de 14:00 a 18:00. ¿Deja sus datos de contacto?" },

    // Conv7 - Pedro - ginecología
    { conversationId: conv7.id, sender: MessageSender.CLIENT, type: MessageType.TEXT, content: "¿Tienen disponibilidad para ginecología?" },
    { conversationId: conv7.id, sender: MessageSender.BOT, type: MessageType.TEXT, content: "Sí, la Dra. Daneliz Ala atiende de lunes a viernes de 12:30 a 21:00. ¿Desea agendar una cita?" },
    { conversationId: conv7.id, sender: MessageSender.CLIENT, type: MessageType.TEXT, content: "Sí, voy el lunes." },

    // Conv8 - Rocío - trauma
    { conversationId: conv8.id, sender: MessageSender.CLIENT, type: MessageType.TEXT, content: "Hola, tengo dolor en la rodilla, ¿atienan traumatología?" },
    { conversationId: conv8.id, sender: MessageSender.BOT, type: MessageType.TEXT, content: "Sí, el Dr. Gustavo Balderrama Uriona atiende Traumatología de lunes a viernes de 18:00 a 20:00. También contamos con ecografía musculoesquelética para diagnóstico. ¿Desea agendar?" },
    { conversationId: conv8.id, sender: MessageSender.CLIENT, type: MessageType.TEXT, content: "Sí, ¿cuánto cuesta la ecografía de rodilla?" },
    { conversationId: conv8.id, sender: MessageSender.BOT, type: MessageType.TEXT, content: "La Ecografía Rodilla Unilateral tiene un costo de Bs 220 y la bilateral de Bs 310. Le recomiendo agendar primero la consulta con el doctor." },
  ];

  for (const m of messagesData) {
    await prisma.messages.create({ data: m });
  }
  console.log(`✔ ${messagesData.length} mensajes creados`);

  // ═══════════════════════════════════════════════════════════
  // 10. LEADS
  // ═══════════════════════════════════════════════════════════
  const cardioServiceId = services.find(s => s.name.includes("Ambulancia"))?.id ?? null;

  const leadsData = [
    { clientId: c1.id, conversationId: conv1.id, specialtyId: findSpec("Cardiología"), status: LeadStatus.QUALIFIED, notes: "Paciente interesado en cardiología" },
    { clientId: c2.id, conversationId: conv2.id, specialtyId: findSpec("Pediatría"), status: LeadStatus.APPOINTMENT_BOOKED, notes: "Cita agendada miércoles 09:00 Pediatría" },
    { clientId: c3.id, conversationId: conv3.id, specialtyId: findSpec("Medicina General"), serviceId: services.find(s => s.name === "Ecografía Abdominal")?.id, status: LeadStatus.APPOINTMENT_BOOKED, notes: "Ecografía abdominal agendada" },
    { clientId: c4.id, conversationId: conv4.id, specialtyId: findSpec("Medicina General"), status: LeadStatus.CLOSED, notes: "Paciente canceló cita" },
    { clientId: c5.id, conversationId: conv5.id, specialtyId: findSpec("Dermatología"), status: LeadStatus.APPOINTMENT_BOOKED, notes: "Cita dermatología agendada" },
    { clientId: c6.id, conversationId: conv6.id, specialtyId: findSpec("Nutrición"), status: LeadStatus.NEW, notes: "Interesada en consulta nutricional" },
    { clientId: c7.id, conversationId: conv7.id, specialtyId: findSpec("Ginecología"), status: LeadStatus.APPOINTMENT_BOOKED, notes: "Cita ginecología lunes" },
    { clientId: c8.id, conversationId: conv8.id, specialtyId: findSpec("Traumatología"), status: LeadStatus.QUALIFIED, notes: "Dolor rodilla, interesado en ecografía" },
    { clientId: c9.id, specialtyId: findSpec("Cardiología"), status: LeadStatus.LOST, notes: "No respondió al seguimiento" },
    { clientId: c10.id, specialtyId: findSpec("Neumología"), status: LeadStatus.CONTACTED, notes: "Pendiente de confirmar cita neumología" },
  ];

  const leads = await prisma.leads.createMany({ data: leadsData });
  console.log(`✔ ${leads.count} leads creados`);

  // ═══════════════════════════════════════════════════════════
  // 11. CITAS
  // ═══════════════════════════════════════════════════════════
  const now = new Date();
  const day = (d: number) => { const date = new Date(now); date.setDate(date.getDate() + d); return date; };
  const at = (d: number, h: number) => { const date = day(d); date.setHours(h, 0, 0, 0); return date; };

  const appointmentsData = [
    { clientId: c2.id, professionalId: p(15), specialtyId: findSpec("Pediatría"), scheduledAt: at(2, 9), status: AppointmentStatus.CONFIRMED, source: AppointmentSource.BOTPRESS, notes: "Consulta pediátrica - niño 5 años" },
    { clientId: c3.id, professionalId: p(12), specialtyId: null, serviceId: services.find(s => s.name === "Ecografía Abdominal")?.id, scheduledAt: at(3, 10), status: AppointmentStatus.CONFIRMED, source: AppointmentSource.BOTPRESS, notes: "Ecografía abdominal" },
    { clientId: c1.id, professionalId: p(5), specialtyId: findSpec("Cardiología"), scheduledAt: at(-2, 14), status: AppointmentStatus.COMPLETED, source: AppointmentSource.BOTPRESS, notes: "Primera consulta cardiológica" },
    { clientId: c4.id, professionalId: p(3), specialtyId: findSpec("Medicina General"), scheduledAt: at(-1, 11), status: AppointmentStatus.CANCELLED, source: AppointmentSource.BOTPRESS, notes: "Paciente canceló" },
    { clientId: c10.id, professionalId: p(20), specialtyId: findSpec("Neumología"), scheduledAt: at(5, 18), status: AppointmentStatus.PENDING, source: AppointmentSource.DASHBOARD, notes: "Consulta neumología programada" },
    { clientId: c5.id, professionalId: p(9), specialtyId: findSpec("Dermatología"), scheduledAt: at(-5, 17), status: AppointmentStatus.COMPLETED, source: AppointmentSource.BOTPRESS, notes: "Evaluación dermatológica" },
    { clientId: c9.id, professionalId: p(6), specialtyId: findSpec("Cardiología"), scheduledAt: at(-3, 16), status: AppointmentStatus.NO_SHOW, source: AppointmentSource.WHATSAPP, notes: "Paciente no se presentó" },
    { clientId: c6.id, professionalId: p(19), specialtyId: findSpec("Nutrición"), scheduledAt: at(7, 14), status: AppointmentStatus.PENDING, source: AppointmentSource.BOTPRESS, notes: "Pendiente confirmación nutrición" },
  ];

  const appointments = await prisma.appointments.createMany({ data: appointmentsData });
  console.log(`✔ ${appointments.count} citas creadas`);

  console.log("✔ Seed completado exitosamente - Centro de Especialidades Annie Atai");
}

main()
  .catch((e) => {
    console.error("Error en seed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
