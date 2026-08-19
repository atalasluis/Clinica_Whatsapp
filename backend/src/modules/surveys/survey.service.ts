import prisma from "../../lib/prisma";

export async function submitSurvey(data: { appointmentId: string; clientId: string; rating: number; comment?: string }) {
  if (data.rating < 1 || data.rating > 5) {
    throw new Error("El rating debe ser entre 1 y 5");
  }

  const survey = {
    id: crypto.randomUUID(),
    appointmentId: data.appointmentId,
    clientId: data.clientId,
    rating: data.rating,
    comment: data.comment || null,
    createdAt: new Date().toISOString(),
  };

  return survey;
}

export async function getSurveyStats() {
  return {
    totalSurveys: 0,
    averageRating: 0,
    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    note: "Encuestas pendientes de implementación con tabla dedicada",
  };
}
