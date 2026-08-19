export async function processImage(imageUrl: string, metadata?: Record<string, unknown>) {
  return {
    status: "RECEIVED",
    imageUrl,
    extractedText: null,
    classification: null,
    confidence: null,
    note: "OCR no configurado. Imagen recibida y almacenada para procesamiento manual.",
    metadata,
    processedAt: new Date().toISOString(),
  };
}

export async function processDocument(imageUrl: string, documentType?: string) {
  return {
    status: "RECEIVED",
    imageUrl,
    documentType: documentType || "unknown",
    extractedData: null,
    note: "Procesamiento de documentos no configurado. Pendiente de integración con servicio OCR.",
    processedAt: new Date().toISOString(),
  };
}
