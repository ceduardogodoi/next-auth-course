"use server";

import { z } from "zod";
import { hash } from "bcryptjs";
import { passwordMatchSchema } from "@/validation/password-match-schema";
import { db } from "@/db/drizzle";
import { users } from "@/db/users-schema";

type RegisterUserArgs = {
  email: string;
  password: string;
  passwordConfirm: string;
};

const newUserSchema = z
  .object({
    email: z.string().email(),
  })
  .and(passwordMatchSchema);

export async function registerUser({
  email,
  password,
  passwordConfirm,
}: RegisterUserArgs) {
  try {
    const newUserValidation = newUserSchema.safeParse({
      email,
      password,
      passwordConfirm,
    });

    if (!newUserValidation.success) {
      return {
        error: true,
        message:
          newUserValidation.error.issues[0].message ?? "An error occured.",
      };
    }

    const hashedPassword = await hash(password, 10);
    await db.insert(users).values({
      email,
      password: hashedPassword,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.code === "23505") {
      return {
        error: true,
        message: "An account is already registered with that email address.",
      };
    }

    return {
      error: true,
      message: "An error occurred.",
    };
  }
}
