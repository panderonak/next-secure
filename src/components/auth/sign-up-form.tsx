"use client";

import { CardWrapper } from "@/components/auth/card-wrapper";
import { signUpSchema } from "@/schemas/sign-up-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-feedback/form-error";
import { FormSuccess } from "@/components/form-feedback/form-success";
import { useState, useTransition } from "react";
import { signUp } from "@/actions/auth/sign-up";

export function SignUpForm() {
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  function onSubmit(values: z.infer<typeof signUpSchema>) {
    setError("");
    setSuccess("");

    startTransition(() => {
      signUp(values).then((data) => {
        if (data.error) {
          setError(data.error);
        } else if (data.success) {
          setSuccess(data.success);
        }
      });
    });
  }

  return (
    <CardWrapper
      headerLabel="Create an account."
      backButtonPrompt="Already have an account?"
      backButtonLabel="Sign In"
      backButtonUrl="/sign-in"
      showSocialIcons
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Username"
                    {...field}
                    disabled={isPending}
                  />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email*</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Email"
                    {...field}
                    type="email"
                    disabled={isPending}
                  />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
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
                  <Input
                    placeholder="Password"
                    {...field}
                    type="password"
                    disabled={isPending}
                  />
                </FormControl>
                <FormDescription>This is your password.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormError message={error} />
          <FormSuccess message={success} />

          <Button type="submit" disabled={isPending} className="w-full">
            Sign Up
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
}
