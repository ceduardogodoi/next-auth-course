import Link from "next/link";
import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { passwordResetTokens } from "@/db/password-reset-tokens-schema";
import { UpdatePasswordForm } from "./update-password-form";

type SearchParams = Promise<{
  [key: string]: string | string[] | undefined;
}>;

type UpdatePasswordProps = {
  searchParams: SearchParams;
};

export default async function UpdatePassword({
  searchParams,
}: UpdatePasswordProps) {
  let tokenIsValid = false;

  const { token } = await searchParams;
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
  }

  return (
    <main className="flex justify-center items-center min-h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>
            {tokenIsValid
              ? "Update password"
              : "Your password reset link is invalid or has expired"}
          </CardTitle>
        </CardHeader>

        <CardContent>
          {tokenIsValid && typeof token === "string" ? (
            <UpdatePasswordForm token={token} />
          ) : (
            <Link className="underline" href="/password-reset">
              Request another password reset link
            </Link>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
