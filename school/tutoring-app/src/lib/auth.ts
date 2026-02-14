import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
          include: {
            school: { select: { id: true, shortName: true } },
            department: { select: { id: true, code: true, name: true } },
            academicClass: { select: { id: true, name: true, academicYear: true } },
          },
        });

        if (!user) return null;

        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!passwordMatch) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          schoolName: user.school?.shortName || null,
          departmentCode: user.department?.code || null,
          className: user.academicClass?.name || null,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as Record<string, unknown>).role as string;
        token.schoolName = (user as Record<string, unknown>).schoolName as string | null;
        token.departmentCode = (user as Record<string, unknown>).departmentCode as string | null;
        token.className = (user as Record<string, unknown>).className as string | null;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as Record<string, unknown>).role = token.role as string;
        (session.user as Record<string, unknown>).schoolName = token.schoolName;
        (session.user as Record<string, unknown>).departmentCode = token.departmentCode;
        (session.user as Record<string, unknown>).className = token.className;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
});
