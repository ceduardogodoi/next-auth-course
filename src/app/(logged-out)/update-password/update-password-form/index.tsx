"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { passwordMatchSchema } from "@/validation/password-match-schema";
import { updatePassword } from "./actions";
import { useToast } from "@/hooks/use-toast";

const formSchema = passwordMatchSchema;

type FormSchema = z.infer<typeof formSchema>;

type UpdatePasswordFormProps = {
  token: string;
};

export function UpdatePasswordForm({ token }: UpdatePasswordFormProps) {
  const { toast } = useToast();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      passwordConfirm: "",
    },
  });

  const handleSubmit: SubmitHandler<FormSchema> = async (data) => {
    const response = await updatePassword({
      token,
      password: data.password,
      passwordConfirm: data.passwordConfirm,
    });
    if (response.error) {
      form.setError("root", {
        message: response.message,
      });

      return;
    }

    toast({
      title: "Password Changed",
      description: "Your password has been updated.",
      className: "bg-green-500 text-white",
    });

    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <fieldset
          className="flex flex-col gap-2"
          disabled={form.formState.isSubmitting}
        >
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="passwordConfirm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password Confirm</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {form.formState.errors.root?.message != null && (
            <FormMessage>{form.formState.errors.root.message}</FormMessage>
          )}

          <Button type="submit">Update Password</Button>
        </fieldset>
      </form>
    </Form>
  );
}
