"use server";

import { signIn } from "@/auth";
import { passwordSchema } from "@/validation/password-schema";
import { z } from "zod";

type CredentialsArgs = {
  email: string;
  password: string;
};

const loginSchema = z.object({
  email: z.string().email(),
  password: passwordSchema,
});

export async function loginWithCredentials(credentials: CredentialsArgs) {
  try {
    const loginValidation = loginSchema.safeParse(credentials);
    if (!loginValidation.success) {
      return {
        error: true,
        message:
          loginValidation.error.issues[0].message ?? "An error occurred.",
      };
    }

    await signIn("credentials", {
      email: credentials.email,
      password: credentials.password,
      redirect: false,
    });
  } catch {
    return {
      error: true,
      message: "Incorrect user or password",
    };
  }
}
