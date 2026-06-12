import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateAuthenticationOptions } from "@simplewebauthn/server";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email');
  
  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: { authenticators: true }
  });

  if (!user || user.authenticators.length === 0) {
    // Return empty options to avoid user enumeration or just generic error
    return NextResponse.json({ error: "No passkeys found for this user" }, { status: 404 });
  }

  const options = await generateAuthenticationOptions({
    rpID: process.env.NEXT_PUBLIC_RP_ID || "localhost",
    allowCredentials: user.authenticators.map(auth => ({
      id: Buffer.from(auth.credentialID, 'base64url') as unknown as Uint8Array,
      type: 'public-key',
      transports: auth.transports ? JSON.parse(auth.transports) : undefined,
    })),
    userVerification: "preferred",
  });

  // Store the challenge temporarily
  await prisma.user.update({
    where: { id: user.id },
    data: { currentChallenge: options.challenge }
  });

  return NextResponse.json(options);
}
