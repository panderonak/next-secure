'use client';

import { CardWrapper } from '@/components/auth/card-wrapper';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FormError } from '@/components/form-feedback/form-error';
import { FormSuccess } from '@/components/form-feedback/form-success';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { BeatLoader } from 'react-spinners';
import { emailSchema } from '@/schemas/sign-up-schema';
import axios, { AxiosError } from 'axios';
import APIResponseInterface from '@/types/APIResponseInterface';

export function ResetPasswordForm() {
  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: '',
    },
  });

  const { reset } = form;

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');

  const router = useRouter();

  function onSubmit(values: z.infer<typeof emailSchema>) {
    setError('');
    setSuccess('');

    startTransition(async () => {
      try {
        const response = await axios.post<APIResponseInterface>(
          '/api/password-reset/initiate',
          values
        );

        console.log(response.data);

        if (response.data.success) setSuccess(response.data.message);

        router.replace(`/sign-in}`);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(
            `Password update failed. \nError Message: ${error.message}\nStack Trace: ${error.stack || 'No stack trace available'}`
          );
        } else {
          console.error(
            `Password update failed. \nUnknown error: ${JSON.stringify(error)}`
          );
        }

        const axiosError = error as AxiosError<APIResponseInterface>;
        const errorMessage =
          axiosError.response?.data.message ||
          'Something went wrong. Please try again.';

        setError(errorMessage);
      } finally {
        reset();
      }
    });
  }

  return (
    <CardWrapper
      headerLabel="Reset your password!"
      backButtonPrompt="Back to"
      backButtonLabel="Sign In"
      backButtonUrl="/sign-in"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
