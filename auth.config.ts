import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_OAUTH_ENABLED,
} from "./lib/env";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// Providers actifs selon les clés disponibles
const providers: NextAuthConfig["providers"] = [
  Credentials({
    async authorize(credentials) {
      const validated = loginSchema.safeParse(credentials);
      if (!validated.success) return null;

      try {
        const user = await prisma.user.findUnique({
          where: { email: validated.data.email },
        });

        if (!user || !user.password) return null;

        const match = await bcrypt.compare(
          validated.data.password,
          user.password
        );
        if (!match) return null;

        return { id: user.id, email: user.email, name: user.name, image: user.image };
      } catch {
        console.warn("[AUTH] Database unavailable during authorize — returning null");
        return null;
      }
    },
  }),
];

// Google OAuth uniquement si les vraies clés sont configurées
if (GOOGLE_OAUTH_ENABLED) {
  providers.push(
    Google({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    })
  );
}

export const authConfig = {
  adapter: PrismaAdapter(prisma),
  providers,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
