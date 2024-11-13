"use server";

import { randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/db/drizzle";
import { users } from "@/db/users-schema";

export async function passwordReset(emailAddress: string) {
  const session = await auth();
  if (session?.user?.id != null) {
    return {
      error: true,
      message: "You are already logged in",
    };
  }

  const [user] = await db
    .select({
      id: users.id,
    })
    .from(users)
    .where(eq(users.email, emailAddress));

  // user doesn't exist
  // but we don't want an attacker
  // to know that
  if (user == null) return;

  const passwordResetToken = randomBytes(32).toString("hex");
  console.log(passwordResetToken);
}
