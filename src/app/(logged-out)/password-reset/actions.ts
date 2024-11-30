"use server";

import { randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/db/drizzle";
import { users } from "@/db/users-schema";
import { passwordResetTokens } from "@/db/password-reset-tokens-schema";
import { mailer } from "@/lib/email";

const ONE_HOUR_IN_MS = 3_600_000;

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
  const tokenExpiry = new Date(Date.now() + ONE_HOUR_IN_MS);
  await db
    .insert(passwordResetTokens)
    .values({
      userId: user.id,
      token: passwordResetToken,
      tokenExpiry,
    })
    .onConflictDoUpdate({
      target: passwordResetTokens.userId,
      set: {
        token: passwordResetToken,
        tokenExpiry,
      },
    });

  const resetLink = new URL("/update-password", process.env.SITE_BASE_URL);
  resetLink.searchParams.set("token", passwordResetToken);

  await mailer.sendMail({
    from: "test@resend.dev",
    subject: "Your password reset request",
    to: emailAddress,
    html: `Hey, ${emailAddress}! You requested to reset your password.
Here's your password reset link. This link will expire in 1 hour:
<a href="${resetLink.href}">${resetLink.href}</a>
    `,
  });

  console.log(passwordResetToken);
}
