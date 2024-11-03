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
import { passwordSchema } from "@/validation/password-schema";
import { changePassword } from "../actions";
import { useToast } from "@/hooks/use-toast";

const formSchema = z
  .object({
    currentPassword: passwordSchema,
  })
  .and(passwordMatchSchema);

type FormSchema = z.infer<typeof formSchema>;

export function ChangePasswordForm() {
  const { toast } = useToast();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: "",
      password: "",
      passwordConfirm: "",
    },
  });

  const handleSubmit: SubmitHandler<FormSchema> = async (data) => {
    const response = await changePassword(data);
    if (response?.error) {
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
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
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

          <Button type="submit">Change Password</Button>
        </fieldset>
      </form>
    </Form>
  );
}
