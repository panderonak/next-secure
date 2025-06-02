'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import * as z from 'zod';
import axios, { AxiosError } from 'axios';
import { Button } from '@/components/ui/button';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useState, useTransition } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

import APIResponseInterface from '@/types/APIResponseInterface';
import { CardWrapper } from '@/components/auth/card-wrapper';
import { FormError } from '@/components/form-feedback/form-error';
import { FormSuccess } from '@/components/form-feedback/form-success';
import { BeatLoader } from 'react-spinners';
import { usernameSchema } from '@/schemas/sign-up-schema';
import { passwordSchema } from '@/schemas/password-reset-schema';

export default function ChangePasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const router = useRouter();

  const params = useParams<{ username: string }>();

  const decodedUsername = decodeURIComponent(params.username);

  const usernameValidation = usernameSchema.safeParse({
    username: decodedUsername,
  });

  if (!usernameValidation.success) {
    setError('Invalid username format. Please check and try again.');
  }

  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  if (!token) {
    setError('Missing token!');
  }

  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  // Real-time password matching feedback
  const password = useWatch({
    control: form.control,
    name: 'password',
  });

  const confirmPassword = useWatch({
    control: form.control,
    name: 'confirmPassword',
  });

  const passwordsMatch = password === confirmPassword && password.length > 0;

  async function onSubmit(data: z.infer<typeof passwordSchema>) {
    setError('');
    setSuccess('');
    startTransition(async () => {
      try {
        const response = await axios.patch<APIResponseInterface>(
          `/api/password-reset/${encodeURIComponent(params.username)}?token=${encodeURIComponent(token!)}`,
          { password: data.password },
          { headers: { 'Content-Type': 'application/json' } }
        );

        if (response.data.success) {
          setSuccess(response.data.message);
          router.replace('/sign-in');
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(
            `Error occurred while resetting password. Error details: ${error}. Stack trace: ${error.stack || 'No stack trace available'}`
          );
        }
        const axiosError = error as AxiosError<APIResponseInterface>;
        const errorMessage =
          axiosError.response?.data.message ||
          'Something went wrong. Please try again.';

        setError(errorMessage);
      }
    });
  }

  return (
    <CardWrapper
      headerLabel="Update your password."
      backButtonPrompt="Back to"
      backButtonLabel="Sign In"
      backButtonUrl="/sign-in"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
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
          {confirmPassword.length > 0 && (
            <p
              className={`text-sm ${passwordsMatch ? 'text-green-500' : 'text-red-500'}`}
            >
              {passwordsMatch
                ? 'Your passwords match.'
                : 'Please make sure both passwords match.'}
            </p>
          )}
          <FormError message={error} />
          <FormSuccess message={success} />

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? <BeatLoader color="#fff" size={5} /> : 'Continue'}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
}
