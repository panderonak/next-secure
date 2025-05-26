"use client";

import { CardWrapper } from "@/components/auth/card-wrapper";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { verificationSchema } from "@/schemas/verification-schema";
import APIResponseInterface from "@/types/APIResponseInterface";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { FormError } from "../form-feedback/form-error";
import { FormSuccess } from "../form-feedback/form-success";
import { formatTime } from "@/lib/format-time";
import { BeatLoader } from "react-spinners";

export function VerificationForm({ username }: { username: string }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds.
  const router = useRouter();

  const form = useForm<z.infer<typeof verificationSchema>>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      code: "",
    },
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer); // Cleanup on unmount
  }, []);

  function onSubmit(values: z.infer<typeof verificationSchema>) {
    startTransition(async () => {
      try {
        setError("");
        setSuccess("");
        const response = await axios.post<APIResponseInterface>(
          `/api/verification/${username}`,
          {
            code: values.code,
          }
        );

        if (response.data.success) setSuccess(response.data.message);

        router.replace("/sign-in");
      } catch (error: any) {
        const axiosError = error as AxiosError<APIResponseInterface>;
        const errorMessage =
          axiosError.response?.data.message ||
          "Something went wrong. Please try again.";

        setError(errorMessage);

        console.error(
          `Error occurred while verifying user. Error details: ${error}. Stack trace: ${error.stack || "No stack trace available"}`
        );
      }
    });
  }

  async function handleResend() {
    setError("");
    setSuccess("");
    try {
      const response = await axios.post<APIResponseInterface>(
        "/api/verification/resend",
        { username }
      );
      if (response.data.success) {
        setSuccess(response.data.message || "OTP resent successfully!");
        setTimeLeft(600); // Reset timer
      }
    } catch (error: any) {
      const axiosError = error as AxiosError<APIResponseInterface>;
      let errorMessage =
        axiosError.response?.data.message ||
        "Something went wrong. Please try again.";

      setError(errorMessage);

      console.error(
        `Error occurred while resending code. Error details: ${error}. Stack trace: ${error.stack || "No stack trace available"}`
      );
    }
  }

  return (
    <CardWrapper
      headerLabel="Account Verification"
      backButtonPrompt="Already have an account?"
      backButtonLabel="Sign In"
      backButtonUrl="/sign-in"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6"
        >
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center justify-center">
                <FormLabel>One-Time Password</FormLabel>
                <FormControl>
                  <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormDescription>
                  Please enter the one-time password sent to your email. Expires
                  in {formatTime(timeLeft)}.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormError message={error} />
          <FormSuccess message={success} />

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? <BeatLoader color="#fff" size={5} /> : "Submit"}
          </Button>

          <Button
            variant="outline"
            onClick={handleResend}
            disabled={isPending || timeLeft === 0}
            className="w-full"
          >
            Resend
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
}
