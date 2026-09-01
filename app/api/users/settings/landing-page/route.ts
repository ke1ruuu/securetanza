import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/backend/lib/prisma";

const ALLOWED_LANDING_PAGES = ["map", "overview", "dashboard", "analytics"];

export async function GET() {
  try {
    const session = await getSession(true);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { defaultLandingPage: true },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      defaultLandingPage: user.defaultLandingPage || "map",
    });
  } catch (error) {
    console.error("Error fetching landing page setting:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession(true);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    let { landingPage } = body;

    if (!landingPage || !ALLOWED_LANDING_PAGES.includes(landingPage)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid landing page. Must be one of: ${ALLOWED_LANDING_PAGES.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Normalize dashboard -> overview if desired
    if (landingPage === "dashboard") {
      landingPage = "overview";
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.userId },
      data: { defaultLandingPage: landingPage },
      select: { id: true, defaultLandingPage: true },
    });

    // Audit log
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    await prisma.auditLog.create({
      data: {
        action: "Settings",
        user: session.accountNumber,
        ip,
        details: `Updated default landing page preference to ${landingPage}`,
        outcome: "success",
        severity: "low",
      },
    });

    return NextResponse.json({
      success: true,
      defaultLandingPage: updatedUser.defaultLandingPage,
    });
  } catch (error) {
    console.error("Error updating landing page preference:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update landing page setting" },
      { status: 500 }
    );
  }
}
