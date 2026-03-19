import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // BUG 4 INTENCIONAL: Fuga de datos
    // El usuario (simulado) pertenece a 'TechCorp', pero aquí traemos todos los tickets
    // de la base de datos sin filtrar.
    const tickets = await prisma.ticket.findMany({
      // FIX: Se agrega filtro por companyId para evitar fuga de datos entre empresas.
      // Antes se devolvían todos los tickets sin restricción, exponiendo información sensible.
      where: {
        companyId: "TechCorp",
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(tickets);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return NextResponse.json(
      { error: "Error fetching tickets" },
      { status: 500 },
    );
  }
}
