import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER')) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Transmission ID is required" },
        { status: 400 }
      );
    }

    await prisma.contactSubmission.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Transmission deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting transmission:", error);
    return NextResponse.json(
      { error: "Failed to delete transmission" },
      { status: 500 }
    );
  }
}
