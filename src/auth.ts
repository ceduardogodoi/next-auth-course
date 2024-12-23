import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "./db/drizzle";
import { users } from "./db/users-schema";
import { eq } from "drizzle-orm";
import { compare } from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  callbacks: {
    jwt({ user, token }) {
      if (user != null) {
        token.id = user.id;
      }

      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;

      return session;
    },
  },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email as string));

        if (user == null) {
          throw new Error("Incorrect credentials");
        }

        const isPasswordCorrect = await compare(
          credentials.password as string,
          user.password!
        );
        if (!isPasswordCorrect) {
          throw new Error("Incorrect credentials");
        }

        return {
          id: user.id.toString(),
          email: user.email,
        };
      },
    }),
  ],
});
