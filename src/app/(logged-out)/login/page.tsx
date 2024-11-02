"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { passwordSchema } from "@/validation/password-schema";
import { loginWithCredentials } from "./actions";
import Link from "next/link";

const formSchema = z.object({
  email: z.string().email(),
  password: passwordSchema,
});

type FormSchema = z.infer<typeof formSchema>;

export default function LoginPage() {
  const router = useRouter();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit: SubmitHandler<FormSchema> = async (data) => {
    const response = await loginWithCredentials(data);
    if (response?.error != null) {
      form.setError("root", {
        message: response.message,
      });
    } else {
      router.push("/my-account");
    }
  };

  return (
    <main className="flex justify-center items-center min-h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Login to your account.</CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <fieldset
                className="flex flex-col gap-2"
                disabled={form.formState.isSubmitting}
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.formState.errors.root?.message != null && (
                  <FormMessage>
                    {form.formState.errors.root.message}
                  </FormMessage>
                )}
                <Button type="submit">Login</Button>
              </fieldset>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex-col gap-2">
          <div className="text-muted-foreground text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="underline">
              Register
            </Link>
          </div>

          <div className="text-muted-foreground text-sm">
            Forgot Password?{" "}
            <Link href="/password-reset" className="underline">
              Reset my password
            </Link>
          </div>
        </CardFooter>
      </Card>
    </main>
  );
}
