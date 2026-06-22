import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.passwordHash) {
          return null;
        }

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);

        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      }
    }),
    CredentialsProvider({
      id: "webauthn",
      name: "Passkey",
      credentials: {
        email: { label: "Email", type: "text" },
        response: { label: "Response", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.response) return null;
        
        const { verifyAuthenticationResponse } = await import("@simplewebauthn/server");
        
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { authenticators: true }
        });
        
        if (!user || !user.currentChallenge) return null;
        
        const response = JSON.parse(credentials.response);
        const authenticator = user.authenticators.find(a => a.credentialID === response.id);
        
        if (!authenticator) return null;
        
        try {
          const verification = await verifyAuthenticationResponse({
            response,
            expectedChallenge: user.currentChallenge,
            expectedOrigin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
            expectedRPID: process.env.NEXT_PUBLIC_RP_ID || "localhost",
            authenticator: {
              credentialID: authenticator.credentialID,
              credentialPublicKey: Buffer.from(authenticator.credentialPublicKey, 'base64url'),
              counter: authenticator.counter,
              transports: authenticator.transports ? authenticator.transports.split(',') as any : undefined,
            }
          });
          
          if (verification.verified) {
            await prisma.authenticator.update({
              where: { credentialID: authenticator.credentialID },
              data: { counter: verification.authenticationInfo.newCounter }
            });
            // Clear challenge
            await prisma.user.update({
              where: { id: user.id },
              data: { currentChallenge: null }
            });
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
            };
          }
        } catch (error) {
          console.error("Passkey verification failed", error);
        }
        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
