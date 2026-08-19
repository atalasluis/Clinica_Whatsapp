import prisma from "../../lib/prisma";
import { MessageSender, MessageType, LeadStatus, ConversationStatus } from "../../generated/prisma/client";

interface BotpressWebhookPayload {
  phone: string;
  firstName?: string;
  lastName?: string;
  externalConversationId?: string;
  source?: string;
  metadata?: Record<string, unknown>;
  message: {
    sender: MessageSender;
    type?: MessageType;
    content?: string;
    mediaUrl?: string;
    metadata?: object;
  };
}

function classifyIntent(text: string): { intent: string; specialty?: string; priority: string } {
  const lower = text.toLowerCase();

  const emergencyKeywords = ["emergencia", "ambulancia", "urgente", "me siento mal", "no puedo respirar", "dolor intenso", "sangrado", "desmayo", "paro"];
  if (emergencyKeywords.some(k => lower.includes(k))) {
    return { intent: "EMERGENCY", priority: "CRITICAL" };
  }

  if (lower.includes("cancelar") || lower.includes("cancela")) {
    return { intent: "CANCEL", priority: "MEDIUM" };
  }

  if (lower.includes("reprogramar") || lower.includes("cambiar cita") || lower.includes("cambiar horario")) {
    return { intent: "RESCHEDULE", priority: "MEDIUM" };
  }

  const appointmentKeywords = ["cita", "agendar", "agendar una cita", "quiero una cita", "necesito una cita", "disponibilidad", "horario disponible"];
  if (appointmentKeywords.some(k => lower.includes(k))) {
    return { intent: "APPOINTMENT_REQUEST", priority: "HIGH" };
  }

  const priceKeywords = ["precio", "cuánto cuesta", "costo", "costa", "presupuesto", "tarifa", "Bs"];
  if (priceKeywords.some(k => lower.includes(k))) {
    return { intent: "PRICE_INQUIRY", priority: "MEDIUM" };
  }

  const complaintKeywords = ["reclamo", "queja", "molestia", "insatisfecho", "mal servicio", "error"];
  if (complaintKeywords.some(k => lower.includes(k))) {
    return { intent: "COMPLAINT", priority: "HIGH" };
  }

  const specialties: Record<string, string[]> = {
    "Cardiología": ["cardiólogo", "cardiología", "corazón", "cardiaco"],
    "Pediatría": ["pediatra", "pediatría", "niño", "bebé", "hijo"],
    "Dermatología": ["dermatólogo", "dermatología", "piel", "acné"],
    "Ginecología": ["ginecólogo", "ginecología", "gineco"],
    "Traumatología": ["traumatólogo", "traumatología", "hueso", "fractura", "rodilla"],
    "Neurología": ["neurólogo", "neurología", "dolor de cabeza", "migraña"],
    "Urología": ["urólogo", "urología", "próstata", "urinario"],
    "Nutrición": ["nutricionista", "nutrición", "dieta", "peso"],
    "Psicología": ["psicólogo", "psicología", "ansiedad", "depresión"],
    "Psiquiatría": ["psiquiatra", "psiquiatría"],
    "Otorrinolaringología": ["otorrino", "oído", "nariz", "garganta"],
    "Gastroenterología": ["gastroenterólogo", "estómago", "digestión"],
    "Endocrinología": ["endocrinólogo", "tiroides", "diabetes", "hormonas"],
    "Reumatología": ["reumatólogo", "artritis", "reuma"],
    "Neumología": ["neumólogo", "pulmón", "respirar", "asma"],
    "Medicina General": ["consulta general", "médico general"],
    "Ecografía": ["ecografía", "ecograf"],
    "Laboratorio": ["laboratorio", "examen", "análisis"],
  };

  for (const [spec, keywords] of Object.entries(specialties)) {
    if (keywords.some(k => lower.includes(k))) {
      return { intent: "SPECIALTY_INQUIRY", specialty: spec, priority: "HIGH" };
    }
  }

  return { intent: "INFO_REQUEST", priority: "LOW" };
}

export async function handleWebhook(payload: BotpressWebhookPayload) {
  const { phone, firstName, lastName, externalConversationId, source, metadata, message } = payload;

  let client = await prisma.clients.findUnique({ where: { phone } });
  if (!client) {
    client = await prisma.clients.create({
      data: {
        phone,
        firstName: firstName ?? undefined,
        lastName: lastName ?? undefined,
      },
    });
  } else if (firstName || lastName) {
    client = await prisma.clients.update({
      where: { id: client.id },
      data: {
        firstName: firstName || undefined,
        lastName: lastName || undefined,
      },
    });
  }

  let conversation;
  if (externalConversationId) {
    conversation = await prisma.conversations.findUnique({
      where: { externalId: externalConversationId },
    });
  }
  if (!conversation) {
    conversation = await prisma.conversations.create({
      data: {
        clientId: client.id,
        externalId: externalConversationId ?? undefined,
      },
    });
  }

  const savedMessage = await prisma.messages.create({
    data: {
      conversationId: conversation.id,
      sender: message.sender,
      type: message.type ?? MessageType.TEXT,
      content: message.content ?? undefined,
      mediaUrl: message.mediaUrl ?? undefined,
      metadata: { ...message.metadata, source: source ?? "WHATSAPP", ...metadata } as any,
    },
  });

  let classification = null;
  let lead = null;

  if (message.sender === "CLIENT" && message.content) {
    classification = classifyIntent(message.content);

    if (classification.priority === "CRITICAL") {
      await prisma.conversations.update({
        where: { id: conversation.id },
        data: { status: ConversationStatus.HUMAN_ATTENTION },
      });
    }

    if (["APPOINTMENT_REQUEST", "SPECIALTY_INQUIRY", "COMPLAINT"].includes(classification.intent)) {
      const specialty = classification.specialty
        ? await prisma.specialties.findFirst({ where: { name: classification.specialty } })
        : null;

      lead = await prisma.leads.create({
        data: {
          clientId: client.id,
          conversationId: conversation.id,
          specialtyId: specialty?.id ?? undefined,
          status: classification.intent === "APPOINTMENT_REQUEST" ? LeadStatus.QUALIFIED : LeadStatus.NEW,
          notes: `[AUTO] Intención: ${classification.intent} | Prioridad: ${classification.priority}${classification.specialty ? ` | Especialidad: ${classification.specialty}` : ""}`,
        },
      });
    }
  }

  return {
    client,
    conversation,
    message: savedMessage,
    classification,
    lead,
  };
}
