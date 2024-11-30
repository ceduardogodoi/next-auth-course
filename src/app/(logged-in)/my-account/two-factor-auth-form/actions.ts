"use server";

import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/db/drizzle";
import { users } from "@/db/users-schema";
import { authenticator } from "otplib";

export async function get2FaSecret() {
  const session = await auth();
  if (session?.user?.id == null || session.user.email == null) {
    return {
      error: true,
      message: "Unauthorized",
    };
  }

  const [user] = await db
    .select({
      twoFactorSecret: users.twoFactorSecret,
    })
    .from(users)
    .where(eq(users.id, parseInt(session.user.id)));
  if (user == null) {
    return {
      error: true,
      message: "User not found",
    };
  }

  let twoFactorSecret = user.twoFactorSecret;
  if (twoFactorSecret == null) {
    twoFactorSecret = authenticator.generateSecret();
    console.log("twoFactorSecret::", twoFactorSecret);
    await db
      .update(users)
      .set({
        twoFactorSecret,
      })
      .where(eq(users.id, parseInt(session.user.id)));
  }

  return {
    twoFactorSecret: authenticator.keyuri(
      session.user.email,
      "WebDevEducation",
      twoFactorSecret
    ),
  };
}
