import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/backend/lib/prisma";

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
      select: { autoLogoutTimer: true },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      autoLogoutTimer: user.autoLogoutTimer || 15,
    });
  } catch (error) {
    console.error("Error fetching auto logout timer setting:", error);
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
    let { autoLogoutTimer } = body;

    // Validate
    if (typeof autoLogoutTimer !== "number" || autoLogoutTimer < 1 || autoLogoutTimer > 1440) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid timer duration. Must be between 1 and 1440 minutes.",
        },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.userId },
      data: { autoLogoutTimer },
      select: { id: true, autoLogoutTimer: true },
    });

    // Audit log
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    await prisma.auditLog.create({
      data: {
        action: "Settings",
        user: session.accountNumber,
        ip,
        details: `Updated auto-logout timer preference to ${autoLogoutTimer} minutes`,
        outcome: "success",
        severity: "low",
      },
    });

    return NextResponse.json({
      success: true,
      autoLogoutTimer: updatedUser.autoLogoutTimer,
    });
  } catch (error) {
    console.error("Error updating auto-logout timer preference:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update auto-logout setting" },
      { status: 500 }
    );
  }
}
