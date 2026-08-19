import prisma from "../../lib/prisma";

export async function getSpecialties() {
  return prisma.specialties.findMany({ where: { active: true } });
}

export async function getServices() {
  return prisma.services.findMany({ where: { active: true } });
}

export async function getProfessionals() {
  return prisma.professionals.findMany({
    where: { active: true },
    include: {
      professional_specialties: { include: { specialties: true } },
      professional_services: { include: { services: true } },
      schedules: true,
    },
  });
}

export async function getSchedules() {
  const schedules = await prisma.schedules.findMany({
    include: { professionals: true },
  });

  const grouped: Record<string, typeof schedules> = {};
  for (const s of schedules) {
    if (!grouped[s.professionalId]) {
      grouped[s.professionalId] = [];
    }
    grouped[s.professionalId].push(s);
  }
  return grouped;
}

export function getFaqs() {
  return [
    {
      question: "¿Cuáles son los horarios de atención?",
      answer:
        "Lunes a viernes de 08:00 a 20:00, sábados de 09:00 a 18:00 y domingos de 08:00 a 15:00.",
    },
    {
      question: "¿Dónde están ubicados?",
      answer: "Centro de Especialidades Annie Atai S.R.L.",
    },
    {
      question: "¿Cómo puedo agendar una cita?",
      answer:
        "Puede agendar una cita enviando un mensaje por WhatsApp indicando la especialidad y horario preferido.",
    },
    {
      question: "¿Cuánto cuesta una ecografía abdominal?",
      answer: "La ecografía abdominal tiene un costo de Bs 220.",
    },
    {
      question: "¿Tienen servicio de ambulancia?",
      answer:
        "Sí, contamos con servicio de ambulancia. Contáctenos para más información.",
    },
    {
      question: "¿Aceptan seguros médicos?",
      answer:
        "Consulte directamente con nuestro personal para información sobre seguros aceptados.",
    },
    {
      question: "¿Cuáles son los precios de las ecografías?",
      answer:
        "Nuestros precios de ecografía van desde Bs 200 hasta Bs 900 dependiendo del estudio. Consulte por el estudio específico que necesita.",
    },
    {
      question: "¿Tienen laboratorio?",
      answer:
        "Sí, contamos con laboratorio clínico de lunes a sábado de 08:00 a 16:00.",
    },
    {
      question: "¿Cuánto cuesta una consulta?",
      answer:
        "Los precios varían según la especialidad. Consulte por la especialidad de su interés.",
    },
    {
      question: "¿Atienden emergencias?",
      answer:
        "Contamos con personal de enfermería las 24 horas. Para emergencias cardíacas, los doctores de cardiología están disponibles a llamado.",
    },
  ];
}

export async function getFullKnowledgeBase() {
  const [specialties, services, professionals, schedules] = await Promise.all([
    getSpecialties(),
    getServices(),
    getProfessionals(),
    getSchedules(),
  ]);

  const scheduleSummary: Record<string, string> = {};
  for (const prof of professionals) {
    const profSchedules = schedules[prof.id];
    if (!profSchedules || profSchedules.length === 0) continue;
    const parts = profSchedules
      .map((s) => {
        const dayLabel = s.dayOfWeek ? s.dayOfWeek.toLowerCase() : "diario";
        return s.startTime && s.endTime
          ? `${dayLabel} ${s.startTime}-${s.endTime}`
          : dayLabel;
      })
      .join(", ");
    scheduleSummary[prof.firstName.toLowerCase()] = parts;
  }

  return {
    clinic: {
      name: "Centro de Especialidades Annie Atai S.R.L.",
      description:
        "Centro médico con especialidades, diagnóstico, rehabilitación y medicina complementaria",
    },
    specialties,
    services,
    professionals,
    schedule_summary: scheduleSummary,
    faqs: getFaqs(),
  };
}
