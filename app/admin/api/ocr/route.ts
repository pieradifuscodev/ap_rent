import { DocumentProcessorServiceClient } from "@google-cloud/documentai";
import { NextResponse } from "next/server";

// Inizializziamo il client
const client = new DocumentProcessorServiceClient({
  apiEndpoint: "eu-documentai.googleapis.com",
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as Blob;
    
    if (!file) {
      return NextResponse.json({ error: "File non ricevuto" }, { status: 400 });
    }

    // Convertiamo il file in Buffer e poi in Base64
    const buffer = Buffer.from(await file.arrayBuffer());
    const encodedImage = buffer.toString("base64");

    // Rileggiamo le variabili d'ambiente (assicurati che siano corrette nel .env.local)
    const projectId = process.env.GCLOUD_PROJECT_ID?.trim();
    const location = process.env.GCLOUD_LOCATION?.trim() || "eu"; // Default eu
    const processorId = process.env.GCLOUD_PROCESSOR_ID?.trim();

    // Costruiamo il nome completo del processore
    const name = `projects/${projectId}/locations/${location}/processors/${processorId}`;
    
    console.log("Chiamata Google con Nome Processore:", name);

    const [result] = await client.processDocument({
      name: name,
      rawDocument: {
        content: encodedImage,
        mimeType: file.type === "application/octet-stream" ? "image/jpeg" : file.type,
      },
    });

    const entities = result.document?.entities || [];
    const extractedData: Record<string, string> = {};
    
    entities.forEach((entity) => {
      if (entity.type) {
        extractedData[entity.type] = entity.mentionText || "";
      }
    });

    return NextResponse.json(extractedData);
  } catch (error: any) {
    console.error("ERRORE GOOGLE AI DETTAGLIATO:", error);
    return NextResponse.json({ 
      error: error.message,
      details: error.details 
    }, { status: 500 });
  }
}