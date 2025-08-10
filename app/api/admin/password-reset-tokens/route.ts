import { NextResponse } from "next/server";
import { getPasswordResetTokens } from "@/lib/password-reset-utils";
import { auth } from "@/auth";

export async function GET() {
  try {
    // Check if user is authenticated and is admin
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has admin role
    const isAdmin = (session.user as any)?.roles?.some(
      (role: any) => role.name === "ROLE_ADMIN"
    );

    if (!isAdmin) {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    const tokens = getPasswordResetTokens();

    return NextResponse.json({
      tokens,
      count: tokens.length,
    });
  } catch (error) {
    console.error("Error fetching password reset tokens:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
