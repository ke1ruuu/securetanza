import { NextResponse } from "next/server";
import { CrimeService } from "@/backend/services/crime.service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const years = await CrimeService.getDistinctYears();
    return NextResponse.json({ years });
  } catch (error) {
    console.error("Error fetching years:", error);
    return NextResponse.json(
      { error: "Failed to fetch years" },
      { status: 500 }
    );
  }
}
