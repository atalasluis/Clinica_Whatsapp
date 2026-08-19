export async function transcribeAudio(audioUrl: string, metadata?: Record<string, unknown>) {
  return {
    status: "RECEIVED",
    audioUrl,
    transcription: null,
    language: "es",
    confidence: null,
    note: "STT no configurado. Audio recibido y almacenado para procesamiento manual.",
    metadata,
    processedAt: new Date().toISOString(),
  };
}
