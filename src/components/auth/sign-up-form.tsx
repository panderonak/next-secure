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
import axios, { AxiosError } from "axios";
import APIResponseInterface from "@/types/APIResponseInterface";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  function onSubmit(values: z.infer<typeof signUpSchema>) {
    setError("");
    setSuccess("");

    startTransition(async () => {
      try {
        console.log("I am inside try.");
        const response = await axios.post<APIResponseInterface>(
          "/api/sign-up",
          values
        );

        console.log(response.data);

        if (response.data.success) setSuccess(response.data.message);

        router.replace(`/verify/${values.username}`);
      } catch (error: any) {
        const axiosError = error as AxiosError<APIResponseInterface>;
        let errorMessage =
          axiosError.response?.data.message ||
          "Something went wrong. Please try again.";

        setError(errorMessage);

        console.error(
          `Error occurred while sign up user. Error details: ${error}. Stack trace: ${error.stack || "No stack trace available"}`
        );
      }
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
