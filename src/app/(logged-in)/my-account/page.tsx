import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { TwoFactorAuthForm } from "./two-factor-auth-form";
import { db } from "@/db/drizzle";
import { users } from "@/db/users-schema";

export default async function MyAccountPage() {
  const session = await auth();

  if (session?.user?.id == null) {
    redirect("/login");
  }

  const [user] = await db
    .select({
      twoFactorActivated: users.twoFactorActivated,
    })
    .from(users)
    .where(eq(users.id, parseInt(session.user.id)));

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>My Account</CardTitle>
      </CardHeader>

      <CardContent>
        <Label>Email Address</Label>
        <div className="text-muted-foreground">{session?.user?.email}</div>

        <TwoFactorAuthForm
          twoFactorActivated={user.twoFactorActivated ?? undefined}
        />
      </CardContent>
    </Card>
  );
}
