"use server";

import { auth } from "@/auth";
import { db } from "@/db/drizzle";
import { users } from "@/db/users-schema";
import { passwordMatchSchema } from "@/validation/password-match-schema";
import { passwordSchema } from "@/validation/password-schema";
import { compare, hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { z } from "zod";

const formSchema = z
  .object({
    currentPassword: passwordSchema,
  })
  .and(passwordMatchSchema);

type ChangePasswordParams = z.infer<typeof formSchema>;

export async function changePassword({
  currentPassword,
  password,
  passwordConfirm,
}: ChangePasswordParams) {
  const session = await auth();
  if (session?.user?.id == null) {
    return {
      error: true,
      message: "You must be logged in to change your password.",
    };
  }

  const passwordValidation = formSchema.safeParse({
    currentPassword,
    password,
    passwordConfirm,
  });
  if (!passwordValidation.success) {
    return {
      error: true,
      message: passwordValidation.error.issues[0].message,
    };
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, parseInt(session.user.id)));
  if (user == null) {
    return {
      error: true,
      message: "User not found",
    };
  }

  const passwordMatch = await compare(currentPassword, user.password!);
  if (!passwordMatch) {
    return {
      error: true,
      message: "Current password is incorrect",
    };
  }

  const hashedPassword = await hash(password, 10);
  await db
    .update(users)
    .set({
      password: hashedPassword,
    })
    .where(eq(users.id, parseInt(session.user.id)));
}
