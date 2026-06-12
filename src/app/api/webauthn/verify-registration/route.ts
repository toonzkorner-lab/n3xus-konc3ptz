import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { verifyRegistrationResponse } from "@simplewebauthn/server";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user || !user.currentChallenge) {
    return NextResponse.json({ error: "Challenge not found" }, { status: 400 });
  }

  const body = await req.json();

  let verification;
  try {
    verification = await verifyRegistrationResponse({
      response: body,
      expectedChallenge: user.currentChallenge,
      expectedOrigin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      expectedRPID: process.env.NEXT_PUBLIC_RP_ID || "localhost",
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  if (verification.verified && verification.registrationInfo) {
    const { credentialID, credentialPublicKey, counter, credentialDeviceType, credentialBackedUp } = verification.registrationInfo;

    const credentialIDString = Buffer.from(credentialID).toString('base64url');

    await prisma.authenticator.create({
      data: {
        credentialID: credentialIDString,
        credentialPublicKey: Buffer.from(credentialPublicKey).toString('base64'),
        counter,
        credentialDeviceType,
        credentialBackedUp,
        userId: user.id,
        providerAccountId: credentialIDString, // using credentialID as providerAccountId
        transports: JSON.stringify(body.response.transports || []),
      }
    });

    // Clear challenge
    await prisma.user.update({
      where: { id: user.id },
      data: { currentChallenge: null }
    });

    return NextResponse.json({ verified: true });
  }

  return NextResponse.json({ error: "Verification failed" }, { status: 400 });
}
