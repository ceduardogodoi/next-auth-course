"use server";

import { auth } from "@/auth";
import { db } from "@/db/drizzle";
import { passwordResetTokens } from "@/db/password-reset-tokens-schema";
import { users } from "@/db/users-schema";
import { passwordMatchSchema } from "@/validation/password-match-schema";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";

type UpdatePasswordParams = {
  token: string;
  password: string;
  passwordConfirm: string;
};

export async function updatePassword({
  token,
  password,
  passwordConfirm,
}: UpdatePasswordParams) {
  const passwordValidation = passwordMatchSchema.safeParse({
    password,
    passwordConfirm,
  });
  if (!passwordValidation.success) {
    return {
      error: true,
      message: passwordValidation.error.issues[0].message,
    };
  }

  const session = await auth();
  if (session?.user?.id != null) {
    return {
      error: true,
      message: "Already logged in. Please log out to reset your password.",
    };
  }

  let tokenIsValid = false;
  if (token != null && typeof token === "string") {
    const [passwordResetToken] = await db
      .select()
      .from(passwordResetTokens)
      .where(eq(passwordResetTokens.token, token));

    const now = Date.now();
    if (
      passwordResetToken?.tokenExpiry != null &&
      now < passwordResetToken.tokenExpiry.getTime()
    ) {
      tokenIsValid = true;
    }

    if (!tokenIsValid) {
      return {
        error: true,
        message: "Your token is invalid or has expired.",
        tokenInvalid: true,
      };
    }

    const hashedPassword = await hash(password, 10);
    await db
      .update(users)
      .set({
        password: hashedPassword,
      })
      .where(eq(users.id, passwordResetToken.userId!));

    await db
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.id, passwordResetToken.id));
  }
}
