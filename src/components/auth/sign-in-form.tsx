'use client';

import { CardWrapper } from '@/components/auth/card-wrapper';
import { signInSchema } from '@/schemas/sign-in-schema';
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
import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { BeatLoader } from 'react-spinners';
import Link from 'next/link';
import { AxiosError } from 'axios';
import APIResponseInterface from '@/types/APIResponseInterface';

export function SignInForm() {
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { reset } = form;

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');

  const router = useRouter();

  const searchParams = useSearchParams();
  const urlError =
    searchParams.get('error') === 'OAuthAccountNotLinked'
      ? 'This email is linked to a different sign-in method.'
      : '';

  const onSubmit = (values: z.infer<typeof signInSchema>) => {
    setError('');
    setSuccess('');
    startTransition(async () => {
      try {
        const response = await signIn('credentials', {
          redirect: false,
          ...values,
        });

        if (response?.error) {
          setError(
            response?.error?.replace(/^Error:\s*/, '') ||
              'Incorrect credentials.'
          );
        }

        if (response?.url) {
          setSuccess('Signed in successfully!');
          router.replace('/settings');
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(
            `Error occurred while sign in. Error details: ${error}. Stack trace: ${error.stack || 'No stack trace available'}`
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
  };

  return (
    <CardWrapper
      headerLabel="Welcome Back!"
      backButtonPrompt="Don't have an account?"
      backButtonLabel="Sign Up"
      backButtonUrl="/sign-up"
      showSocialIcons
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
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password*</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Password"
                    {...field}
                    type="password"
                    disabled={isPending}
                  />
                </FormControl>
                <Button
                  size="sm"
                  variant="link"
                  className="px-0 font-normal w-1/2"
                  asChild
                >
                  <Link href={'/reset-password'}>Forgot Password?</Link>
                </Button>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormError message={error || urlError} />
          <FormSuccess message={success} />

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? <BeatLoader color="#fff" size={5} /> : 'Sign In'}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
}
