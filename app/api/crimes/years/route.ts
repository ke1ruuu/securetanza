import { NextResponse } from "next/server";
import { prisma } from "@/backend/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Get distinct years from dateCommitted field
    const result = await prisma.$queryRaw<Array<{ year: number }>>`
      SELECT DISTINCT EXTRACT(YEAR FROM date_committed)::integer as year
      FROM crime_incidents
      ORDER BY year DESC
    `;

    const years = result.map((row) => row.year);

    return NextResponse.json({ years });
  } catch (error) {
    console.error("Error fetching years:", error);
    return NextResponse.json(
      { error: "Failed to fetch years" },
      { status: 500 }
    );
  }
}
