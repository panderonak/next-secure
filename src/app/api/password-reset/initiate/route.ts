import { getUserByEmail } from '@/data/user';
import { resetPasswordEmailSender } from '@/lib/emails/reset-password-email-sender';
import { generateAndSaveResetPasswordToken } from '@/lib/reset-password-token';
import { emailSchema } from '@/schemas/sign-up-schema';
import APIResponseInterface from '@/types/APIResponseInterface';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { email } = await request.json();

    const emailValidation = emailSchema.safeParse({ email });

    if (!emailValidation.success) {
      const emailErrors = emailValidation.error.format().email?._errors;

      if (emailErrors && emailErrors.length > 0) {
        console.error(`Validation failed for email: ${emailErrors.join(', ')}`);
      } else {
        console.error(
          'Validation failed for email, but no specific errors were provided.'
        );
      }

      const responseBody: APIResponseInterface = {
        success: false,
        message: `Invalid email format. Please check and try again.`,
      };

      return NextResponse.json(responseBody, { status: 400 });
    }

    const existingUser = await getUserByEmail(email);

    if (
      !existingUser ||
      !existingUser.emailVerified ||
      !existingUser.username
    ) {
      const responseBody: APIResponseInterface = {
        success: false,
        message: `We couldn't find a user with that email. Please double-check and try again.`,
      };

      return NextResponse.json(responseBody, { status: 400 });
    }

    const resetPasswordToken = await generateAndSaveResetPasswordToken(email);

    const username = existingUser?.username;

    const resetPasswordEmailResponse = await resetPasswordEmailSender(
      email,
      username,
      resetPasswordToken
    );

    if (!resetPasswordEmailResponse.success) {
      const responseBody: APIResponseInterface = {
        success: false,
        message: `${resetPasswordEmailResponse.message}`,
      };

      return NextResponse.json(responseBody, { status: 500 });
    }

    const responseBody: APIResponseInterface = {
      success: true,
      message: `You're all set! Check your email to verify your account.`,
    };

    return NextResponse.json(responseBody, { status: 200 });
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

    const responseBody: APIResponseInterface = {
      success: false,
      message: `We're currently experiencing issues verifying your account. Please try again in a moment.`,
    };

    return NextResponse.json(responseBody, { status: 500 });
  }
}
