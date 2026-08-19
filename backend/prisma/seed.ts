import dotenv from "dotenv";
dotenv.config();
import { PrismaClient, ServiceCategory, ScheduleType, DayOfWeek, AdminRole, ConversationStatus, MessageSender, MessageType, LeadStatus, AppointmentStatus, AppointmentSource } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Iniciando seed...");

  // ─── Especialidades ────────────────────────────────────────
  const specialtiesData = [
    { name: "Medicina General" },
    { name: "Medicina Familiar" },
    { name: "Medicina Interna" },
    { name: "Cardiología" },
    { name: "Endocrinología" },
    { name: "Gastroenterología" },
    { name: "Pediatría" },
    { name: "Traumatología" },
    { name: "Urología" },
    { name: "Psicología" },
    { name: "Psiquiatría" },
    { name: "Nutrición" },
    { name: "Dermatología" },
    { name: "Neumología" },
    { name: "Neurología" },
    { name: "Oftalmología" },
    { name: "Otorrinolaringología" },
    { name: "Ginecología" },
    { name: "Obstetricia" },
    { name: "Cirugía General" },
    { name: "Cirugía Plástica" },
    { name: "Reumatología" },
    { name: "Nefrología" },
    { name: "Hematología" },
    { name: "Oncología" },
    { name: "Medicina Estética" },
  ];

  const specialties: { id: string; name: string }[] = [];
  for (const s of specialtiesData) {
    const result = await prisma.specialties.upsert({
      where: { name: s.name },
      update: {},
      create: s,
    });
    specialties.push(result);
  }

  console.log(`✔ ${specialties.length} especialidades creadas`);

  // ─── Servicios ─────────────────────────────────────────────
  const servicesData = [
    { name: "Ecografía Abdominal", category: ServiceCategory.DIAGNOSTIC, price: 200, currency: "BOB" },
    { name: "Ecografía Mamaria", category: ServiceCategory.DIAGNOSTIC, price: 250, currency: "BOB" },
    { name: "Ecografía Obstétrica", category: ServiceCategory.DIAGNOSTIC, price: 200, currency: "BOB" },
    { name: "Ecografía Renal", category: ServiceCategory.DIAGNOSTIC, price: 200, currency: "BOB" },
    { name: "Laboratorio Clínico", category: ServiceCategory.DIAGNOSTIC, price: null },
    { name: "Fisioterapia", category: ServiceCategory.REHABILITATION, price: 150, currency: "BOB" },
    { name: "Ozonoterapia", category: ServiceCategory.COMPLEMENTARY, price: 300, currency: "BOB" },
    { name: "Servicio de Ambulancia", category: ServiceCategory.OTHER, price: null },
    { name: "Servicio de Enfermería", category: ServiceCategory.OTHER, price: null },
  ];

  const services: { id: string; name: string }[] = [];
  for (const s of servicesData) {
    const result = await prisma.services.upsert({
      where: { name: s.name },
      update: {},
      create: s,
    });
    services.push(result);
  }

  console.log(`✔ ${services.length} servicios creados`);

  // ─── Profesionales ─────────────────────────────────────────
  const professionalsData = [
    { firstName: "Carlos", lastName: "Mendoza", title: "Dr." },
    { firstName: "Ana", lastName: "García", title: "Dra." },
    { firstName: "Luis", lastName: "Torres", title: "Dr." },
    { firstName: "María", lastName: "Fernández", title: "Dra." },
    { firstName: "Roberto", lastName: "Suárez", title: "Dr." },
    { firstName: "Patricia", lastName: "López", title: "Dra." },
    { firstName: "Fernando", lastName: "Ríos", title: "Dr." },
    { firstName: "Claudia", lastName: "Morales", title: "Dra." },
    { firstName: "Jorge", lastName: "Vargas", title: "Dr." },
    { firstName: "Sandra", lastName: "Cáceres", title: "Dra." },
  ];

  const professionals: { id: string; firstName: string; lastName?: string | null }[] = [];
  for (const p of professionalsData) {
    const result = await prisma.professionals.upsert({
      where: { id: p.firstName + p.lastName },
      update: {},
      create: p,
    }).catch(() => prisma.professionals.create({ data: p }));
    professionals.push(result);
  }

  console.log(`✔ ${professionals.length} profesionales creados`);

  // ─── Relación Profesional-Especialidad ──────────────────────
  const [medGen, medFam, cardio, ped, nutri, psi] = specialties;
  const [dr1, dra2, dr3, dra4, dr5] = professionals;

  const profSpecData = [
    { professionalId: dr1.id, specialtyId: medGen.id },
    { professionalId: dra2.id, specialtyId: medFam.id },
    { professionalId: dr3.id, specialtyId: cardio.id },
    { professionalId: dra4.id, specialtyId: ped.id },
    { professionalId: dr5.id, specialtyId: nutri.id },
    { professionalId: dra4.id, specialtyId: psi.id },
  ];

  for (const ps of profSpecData) {
    await prisma.professional_specialties.upsert({
      where: { professionalId_specialtyId: ps },
      update: {},
      create: ps,
    }).catch(() => {});
  }

  console.log("✔ Relaciones profesional-especialidad creadas");

  // ─── Horarios ──────────────────────────────────────────────
  const scheduleData = [
    { professionalId: dr1.id, specialtyId: medGen.id, type: ScheduleType.FIXED, dayOfWeek: DayOfWeek.MONDAY, startTime: "08:00", endTime: "12:00" },
    { professionalId: dr1.id, specialtyId: medGen.id, type: ScheduleType.FIXED, dayOfWeek: DayOfWeek.WEDNESDAY, startTime: "08:00", endTime: "12:00" },
    { professionalId: dr1.id, specialtyId: medGen.id, type: ScheduleType.FIXED, dayOfWeek: DayOfWeek.FRIDAY, startTime: "08:00", endTime: "12:00" },
    { professionalId: dra2.id, specialtyId: medFam.id, type: ScheduleType.FIXED, dayOfWeek: DayOfWeek.TUESDAY, startTime: "09:00", endTime: "13:00" },
    { professionalId: dra2.id, specialtyId: medFam.id, type: ScheduleType.FIXED, dayOfWeek: DayOfWeek.THURSDAY, startTime: "09:00", endTime: "13:00" },
    { professionalId: dr3.id, specialtyId: cardio.id, type: ScheduleType.FIXED, dayOfWeek: DayOfWeek.MONDAY, startTime: "14:00", endTime: "18:00" },
    { professionalId: dr3.id, specialtyId: cardio.id, type: ScheduleType.FIXED, dayOfWeek: DayOfWeek.THURSDAY, startTime: "14:00", endTime: "18:00" },
    { professionalId: dra4.id, specialtyId: ped.id, type: ScheduleType.FIXED, dayOfWeek: DayOfWeek.MONDAY, startTime: "09:00", endTime: "13:00" },
    { professionalId: dra4.id, specialtyId: ped.id, type: ScheduleType.FIXED, dayOfWeek: DayOfWeek.WEDNESDAY, startTime: "09:00", endTime: "13:00" },
    { professionalId: dra4.id, specialtyId: ped.id, type: ScheduleType.FIXED, dayOfWeek: DayOfWeek.FRIDAY, startTime: "09:00", endTime: "13:00" },
    { professionalId: dr5.id, specialtyId: nutri.id, type: ScheduleType.TO_COORDINATE },
    { professionalId: dr3.id, specialtyId: cardio.id, type: ScheduleType.ON_CALL, notes: "Emergencias cardíacas a llamado" },
  ];

  for (const s of scheduleData) {
    await prisma.schedules.create({ data: s });
  }

  console.log(`✔ ${scheduleData.length} horarios creados`);

  // ─── Usuarios administrativos ─────────────────────────────
  const adminUsersData = [
    { name: "María Elena Vargas", email: "maria.vargas@clinica.com", passwordHash: "$2b$10$placeholder_hash_admin_01", role: AdminRole.ADMIN },
    { name: "Carlos Mendoza Ríos", email: "carlos.mendoza@clinica.com", passwordHash: "$2b$10$placeholder_hash_admin_02", role: AdminRole.ADMIN },
    { name: "Ana Lucía Gutiérrez", email: "ana.gutierrez@clinica.com", passwordHash: "$2b$10$placeholder_hash_sec_01", role: AdminRole.RECEPTIONIST },
    { name: "Patricia Flores Martínez", email: "patricia.flores@clinica.com", passwordHash: "$2b$10$placeholder_hash_sec_02", role: AdminRole.RECEPTIONIST },
    { name: "Rocío Jiménez Peña", email: "rocio.jimenez@clinica.com", passwordHash: "$2b$10$placeholder_hash_sec_03", role: AdminRole.RECEPTIONIST },
    { name: "Sandra Bolivia Torres", email: "sandra.torres@clinica.com", passwordHash: "$2b$10$placeholder_hash_sec_04", role: AdminRole.RECEPTIONIST },
    { name: "Dr. Luis Fernando Paredes", email: "luis.paredes@clinica.com", passwordHash: "$2b$10$placeholder_hash_doc_01", role: AdminRole.DOCTOR },
    { name: "Dra. Claudia Beatriz Soliz", email: "claudia.soliz@clinica.com", passwordHash: "$2b$10$placeholder_hash_doc_02", role: AdminRole.DOCTOR },
    { name: "Dr. Fernando Arancibia Lopez", email: "fernando.arancibia@clinica.com", passwordHash: "$2b$10$placeholder_hash_doc_03", role: AdminRole.DOCTOR },
    { name: "Dra. Gabriela Mercado Viera", email: "gabriela.mercado@clinica.com", passwordHash: "$2b$10$placeholder_hash_doc_04", role: AdminRole.DOCTOR },
  ];

  for (const user of adminUsersData) {
    await prisma.admin_users.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
  }

  console.log(`✔ ${adminUsersData.length} usuarios administrativos creados`);

  // ─── Clientes (pacientes) ─────────────────────────────────
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

  const clients: { id: string; phone: string; firstName?: string | null; lastName?: string | null }[] = [];
  for (const c of clientsData) {
    const result = await prisma.clients.upsert({
      where: { phone: c.phone },
      update: {},
      create: c,
    });
    clients.push(result);
  }

  console.log(`✔ ${clients.length} clientes creados`);

  // ─── Conversaciones ───────────────────────────────────────
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
    const result = await prisma.conversations.upsert({
      where: { externalId: c.externalId },
      update: {},
      create: c,
    });
    conversations.push(result);
  }

  console.log(`✔ ${conversations.length} conversaciones creadas`);

  // ─── Mensajes ─────────────────────────────────────────────
  const [conv1, conv2, conv3, conv4, conv5, conv6, conv7, conv8] = conversations;

  const messagesData = [
    // Conv1 - Juan preguntando por cardiología
    { conversationId: conv1.id, sender: MessageSender.CLIENT, type: MessageType.TEXT, content: "Hola, buenas tardes. Quisiera saber si tienen cardiología disponible." },
    { conversationId: conv1.id, sender: MessageSender.BOT, type: MessageType.TEXT, content: "¡Buenas tardes! Sí, contamos con servicio de cardiología. ¿Desea agendar una cita?" },
    { conversationId: conv1.id, sender: MessageSender.CLIENT, type: MessageType.TEXT, content: "Sí, por favor. ¿Cuándo hay disponibilidad?" },
    { conversationId: conv1.id, sender: MessageSender.BOT, type: MessageType.TEXT, content: "Tenemos disponibilidad los lunes y jueves de 14:00 a 18:00. ¿Le sirve alguno de esos días?" },

    // Conv2 - María - consulta general
    { conversationId: conv2.id, sender: MessageSender.CLIENT, type: MessageType.TEXT, content: "Buenos días, necesito una consulta general para mi hijo de 5 años." },
    { conversationId: conv2.id, sender: MessageSender.BOT, type: MessageType.TEXT, content: "¡Buenos días! Para consultas pediátricas tenemos disponibilidad de lunes a viernes. ¿Quiere agendar?" },
    { conversationId: conv2.id, sender: MessageSender.CLIENT, type: MessageType.TEXT, content: "Sí, el miércoles por la mañana estaría bien." },
    { conversationId: conv2.id, sender: MessageSender.BOT, type: MessageType.TEXT, content: "Perfecto, he agendado una cita para el miércoles a las 09:00 con la Dra. María Fernández en Pediatría. ¡Que tenga un buen día!" },

    // Conv3 - Carlos - emergencia
    { conversationId: conv3.id, sender: MessageSender.CLIENT, type: MessageType.TEXT, content: "Necesito una ambulancia, mi padre se siente mal" },
    { conversationId: conv3.id, sender: MessageSender.BOT, type: MessageType.TEXT, content: "Entendemos la urgencia. Por favor indique su dirección exacta para despachar la ambulancia." },
    { conversationId: conv3.id, sender: MessageSender.CLIENT, type: MessageType.TEXT, content: "Calle Colombia #245, zona San Miguel" },

    // Conv4 - Ana - atención humana
    { conversationId: conv4.id, sender: MessageSender.CLIENT, type: MessageType.TEXT, content: "QuieroCancelar mi cita del viernes" },
    { conversationId: conv4.id, sender: MessageSender.BOT, type: MessageType.TEXT, content: "Lamento escuchar eso. Para cancelaciones, una persona de nuestro equipo la atenderá. Un momento por favor." },
    { conversationId: conv4.id, sender: MessageSender.STAFF, type: MessageType.TEXT, content: "Buenas tardes Ana, soy Patricia de recepción. ¿Puede indicarme cuál es el motivo de la cancelación?" },

    // Conv5 - Luis - ecografía
    { conversationId: conv5.id, sender: MessageSender.CLIENT, type: MessageType.TEXT, content: "Hola, ¿cuánto cuesta una ecografía abdominal?" },
    { conversationId: conv5.id, sender: MessageSender.BOT, type: MessageType.TEXT, content: "La ecografía abdominal tiene un costo de 200 BOB. ¿Desea agendar una cita?" },
    { conversationId: conv5.id, sender: MessageSender.CLIENT, type: MessageType.TEXT, content: "Sí, ¿tienen disponibilidad esta semana?" },
    { conversationId: conv5.id, sender: MessageSender.BOT, type: MessageType.TEXT, content: "Sí, tenemos disponibilidad el jueves por la mañana. ¿Le parece bien?" },
    { conversationId: conv5.id, sender: MessageSender.CLIENT, type: MessageType.TEXT, content: "Perfecto, agéndenla por favor." },

    // Conv6 - Gabriela - nutrición
    { conversationId: conv6.id, sender: MessageSender.CLIENT, type: MessageType.TEXT, content: "Buenas, quiero una consulta de nutrición" },
    { conversationId: conv6.id, sender: MessageSender.BOT, type: MessageType.TEXT, content: "¡Claro! Nuestro servicio de nutrición está disponible. Los horarios se coordinan directamente. ¿Deja sus datos de contacto?" },

    // Conv7 - Pedro - laboratorio
    { conversationId: conv7.id, sender: MessageSender.CLIENT, type: MessageType.TEXT, content: "¿Hacen exámenes de laboratorio?" },
    { conversationId: conv7.id, sender: MessageSender.BOT, type: MessageType.TEXT, content: "Sí, contamos con servicio de laboratorio clínico. Puede acudir de lunes a sábado en horario de 07:00 a 12:00 en ayuno." },
    { conversationId: conv7.id, sender: MessageSender.CLIENT, type: MessageType.TEXT, content: "Gracias, voy el lunes." },

    // Conv8 - Rocío - derma
    { conversationId: conv8.id, sender: MessageSender.CLIENT, type: MessageType.TEXT, content: "Hola, tengo una consulta de dermatología" },
    { conversationId: conv8.id, sender: MessageSender.BOT, type: MessageType.TEXT, content: "Para dermatología puede agendar su cita indicando el motivo. ¿Qué consulta necesita?" },
    { conversationId: conv8.id, sender: MessageSender.CLIENT, type: MessageType.IMAGE, content: null, mediaUrl: "https://example.com/derma_photo.jpg" },
    { conversationId: conv8.id, sender: MessageSender.BOT, type: MessageType.TEXT, content: "Gracias por la imagen. Le recomiendo agendar una consulta presencial para una evaluación completa." },
  ];

  for (const m of messagesData) {
    await prisma.messages.create({ data: m });
  }

  console.log(`✔ ${messagesData.length} mensajes creados`);

  // ─── Leads ────────────────────────────────────────────────
  const specialtyCardio = await prisma.specialties.findUnique({ where: { name: "Cardiología" } });
  const specialtyPed = await prisma.specialties.findUnique({ where: { name: "Pediatría" } });
  const specialtyDerm = await prisma.specialties.findUnique({ where: { name: "Dermatología" } });
  const specialtyNutri = await prisma.specialties.findUnique({ where: { name: "Nutrición" } });
  const specialtyMedGen = await prisma.specialties.findUnique({ where: { name: "Medicina General" } });
  const serviceEco = await prisma.services.findUnique({ where: { name: "Ecografía Abdominal" } });
  const serviceLab = await prisma.services.findUnique({ where: { name: "Laboratorio Clínico" } });
  const serviceAmbu = await prisma.services.findUnique({ where: { name: "Servicio de Ambulancia" } });

  const leadsData = [
    { clientId: c1.id, conversationId: conv1.id, specialtyId: specialtyCardio?.id, status: LeadStatus.QUALIFIED, notes: "Paciente interesado en cardiología" },
    { clientId: c2.id, conversationId: conv2.id, specialtyId: specialtyPed?.id, status: LeadStatus.APPOINTMENT_BOOKED, notes: "Cita agendada miércoles 09:00" },
    { clientId: c3.id, conversationId: conv3.id, serviceId: serviceAmbu?.id, status: LeadStatus.CONTACTED, notes: "Emergencia - ambulancia despachada" },
    { clientId: c4.id, conversationId: conv4.id, specialtyId: specialtyMedGen?.id, status: LeadStatus.CLOSED, notes: "Paciente canceló cita" },
    { clientId: c5.id, conversationId: conv5.id, serviceId: serviceEco?.id, specialtyId: specialtyMedGen?.id, status: LeadStatus.APPOINTMENT_BOOKED, notes: "Cita ecografía jueves mañana" },
    { clientId: c6.id, conversationId: conv6.id, specialtyId: specialtyNutri?.id, status: LeadStatus.NEW, notes: "Interesada en consulta nutricional" },
    { clientId: c7.id, conversationId: conv7.id, serviceId: serviceLab?.id, status: LeadStatus.NEW, notes: "Exámenes de laboratorio" },
    { clientId: c8.id, conversationId: conv8.id, specialtyId: specialtyDerm?.id, status: LeadStatus.QUALIFIED, notes: "Consulta dermatológica, envió foto" },
    { clientId: c9.id, specialtyId: specialtyCardio?.id, status: LeadStatus.LOST, notes: "No respondió al seguimiento" },
    { clientId: c10.id, specialtyId: specialtyMedGen?.id, status: LeadStatus.CONTACTED, notes: "Pendiente de confirmar cita" },
  ];

  const leads = await prisma.leads.createMany({ data: leadsData });
  console.log(`✔ ${leads.count} leads creados`);

  // ─── Citas ────────────────────────────────────────────────
  const profeCardio = await prisma.professionals.findFirst({ where: { firstName: "Luis" } });
  const profePed = await prisma.professionals.findFirst({ where: { firstName: "María", lastName: "Fernández" } });
  const profeMedGen = await prisma.professionals.findFirst({ where: { firstName: "Carlos" } });
  const profeNutri = await prisma.professionals.findFirst({ where: { firstName: "Roberto" } });

  const now = new Date();
  const day = (d: number) => { const date = new Date(now); date.setDate(date.getDate() + d); return date; };
  const at = (d: number, h: number) => { const date = day(d); date.setHours(h, 0, 0, 0); return date; };

  const appointmentsData = [
    { clientId: c2.id, professionalId: profePed?.id!, specialtyId: specialtyPed?.id, scheduledAt: at(2, 9), status: AppointmentStatus.CONFIRMED, source: AppointmentSource.BOTPRESS, notes: "Consulta pediátrica - niño 5 años" },
    { clientId: c5.id, professionalId: profeMedGen?.id!, serviceId: serviceEco?.id, specialtyId: specialtyMedGen?.id, scheduledAt: at(3, 10), status: AppointmentStatus.CONFIRMED, source: AppointmentSource.BOTPRESS, notes: "Ecografía abdominal" },
    { clientId: c1.id, professionalId: profeCardio?.id!, specialtyId: specialtyCardio?.id, scheduledAt: at(-2, 14), status: AppointmentStatus.COMPLETED, source: AppointmentSource.BOTPRESS, notes: "Primera consulta cardiológica" },
    { clientId: c4.id, professionalId: profeMedGen?.id!, specialtyId: specialtyMedGen?.id, scheduledAt: at(-1, 11), status: AppointmentStatus.CANCELLED, source: AppointmentSource.BOTPRESS, notes: "Paciente canceló" },
    { clientId: c10.id, professionalId: profeNutri?.id!, specialtyId: specialtyNutri?.id, scheduledAt: at(5, 9), status: AppointmentStatus.PENDING, source: AppointmentSource.DASHBOARD, notes: "Consulta nutricional programada" },
    { clientId: c8.id, professionalId: profeMedGen?.id!, specialtyId: specialtyDerm?.id, scheduledAt: at(-5, 15), status: AppointmentStatus.COMPLETED, source: AppointmentSource.BOTPRESS, notes: "Evaluación dermatológica" },
    { clientId: c9.id, professionalId: profeCardio?.id!, specialtyId: specialtyCardio?.id, scheduledAt: at(-3, 16), status: AppointmentStatus.NO_SHOW, source: AppointmentSource.WHATSAPP, notes: "Paciente no se presentó" },
    { clientId: c6.id, professionalId: profeNutri?.id!, specialtyId: specialtyNutri?.id, scheduledAt: at(7, 10), status: AppointmentStatus.PENDING, source: AppointmentSource.BOTPRESS, notes: "Pendiente confirmación" },
  ];

  const appointments = await prisma.appointments.createMany({ data: appointmentsData });
  console.log(`✔ ${appointments.count} citas creadas`);

  console.log("Seed completado exitosamente");
}

main()
  .catch((e) => {
    console.error("Error en seed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
