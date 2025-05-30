import { db } from '@/lib/db';
import { UsernameSchema } from '@/schemas/sign-up-schema';
import { verificationSchema } from '@/schemas/verification-schema';
import APIResponseInterface from '@/types/APIResponseInterface';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { username: string } }
): Promise<NextResponse> {
  try {
    const decodedUsername = decodeURIComponent(params.username);

    const usernameValidation = UsernameSchema.safeParse({
      username: decodedUsername,
    });

    if (!usernameValidation.success) {
      const usernameErrors =
        usernameValidation.error.format().username?._errors;

      if (usernameErrors && usernameErrors.length > 0) {
        console.error(
          `Validation failed for username: ${usernameErrors.join(', ')}`
        );
      } else {
        console.error(
          'Validation failed for username, but no specific errors were provided.'
        );
      }

      const responseBody: APIResponseInterface = {
        success: false,
        message: `Invalid username format. Please check and try again.`,
      };

      return NextResponse.json(responseBody, { status: 400 });
    }

    const { code } = await request.json();

    const codeValidation = verificationSchema.safeParse({ code });

    if (!codeValidation.success) {
      const codeErrors = codeValidation.error.format().code?._errors;

      if (codeErrors && codeErrors.length > 0) {
        console.error(`Validation failed for code: ${codeErrors.join(', ')}`);
      } else {
        console.error(
          'Validation failed for code, but no specific errors were provided.'
        );
      }
      const responseBody: APIResponseInterface = {
        success: false,
        message:
          'Hmm, that code doesn’t look right. Please check and try again.',
      };

      return NextResponse.json(responseBody, { status: 400 });
    }

    const { username } = usernameValidation.data;

    const existingUser = await db?.user.findFirst({
      where: { username },
    });

    if (!existingUser || !existingUser.email) {
      const responseBody: APIResponseInterface = {
        success: false,
        message: `We couldn\'t find an account with that info. Please double-check and try again.`,
      };

      return NextResponse.json(responseBody, { status: 404 });
    }

    const existingCode = await db.verificationCode.findFirst({
      where: { email: existingUser?.email, code: codeValidation.data.code },
    });

    if (!existingCode) {
      const responseBody: APIResponseInterface = {
        success: false,
        message:
          'Your enterd verification code is not valid. Please check and ensure that you typed correct code.',
      };

      return NextResponse.json(responseBody, { status: 400 });
    }

    const isVerificationCodeExpired = existingCode?.expires < new Date();

    if (isVerificationCodeExpired) {
      const responseBody: APIResponseInterface = {
        success: false,
        message: `Your verification code has expired. Please sign up again to receive a new code.`,
      };

      return NextResponse.json(responseBody, { status: 400 });
    }

    await db.verificationCode.delete({ where: { id: existingCode.id } });

    await db.user.update({
      where: { username },
      data: { emailVerified: new Date(), email: existingCode.email },
    });

    const responseBody: APIResponseInterface = {
      success: true,
      message: `Your account has been successfully verified!`,
    };

    return NextResponse.json(responseBody, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(
        `Error occurred while verifying the user. Details: ${error.message || error}. Stack trace: ${error.stack || 'No stack trace available'}`
      );
    }

    const responseBody: APIResponseInterface = {
      success: false,
      message: `We're experiencing an issue while verifying the user. Please try again shortly.`,
    };

    return NextResponse.json(responseBody, { status: 500 });
  }
}
