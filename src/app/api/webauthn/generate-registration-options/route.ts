import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateRegistrationOptions } from "@simplewebauthn/server";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { authenticators: true }
  });

  if (!user || !user.email) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const options = await generateRegistrationOptions({
    rpName: "N3xUs Konc3pt'z",
    rpID: process.env.NEXT_PUBLIC_RP_ID || "localhost",
    userID: user.id,
    userName: user.email,
    attestationType: "none",
    excludeCredentials: user.authenticators.map(auth => ({
      id: Buffer.from(auth.credentialID, 'base64url') as unknown as Uint8Array,
      type: 'public-key',
      transports: auth.transports ? JSON.parse(auth.transports) : undefined,
    })),
    authenticatorSelection: {
      residentKey: "preferred",
      userVerification: "preferred",
    },
  });

  // Store the challenge temporarily in the database for verification
  await prisma.user.update({
    where: { id: user.id },
    data: { currentChallenge: options.challenge }
  });

  return NextResponse.json(options);
}
