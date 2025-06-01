import { db } from '@/lib/db';
import { resetPasswordTokenSchema } from '@/schemas/reset-password-token-schema';
import { passwordSchema, usernameSchema } from '@/schemas/sign-up-schema';
import APIResponseInterface from '@/types/APIResponseInterface';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { username: string } }
): Promise<NextResponse> {
  try {
    const decodedUsername = decodeURIComponent(params.username);

    const usernameValidation = usernameSchema.safeParse({
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

    const { searchParams } = new URL(request.url);

    const queryParam = {
      token: searchParams.get('token'),
    };

    const { token } = queryParam;

    const tokenValidation = resetPasswordTokenSchema.safeParse({ token });

    if (!tokenValidation.success) {
      const codeErrors = tokenValidation.error.format().token?._errors;

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
          'Hmm, that token doesn’t look right. Please check and try again.',
      };

      return NextResponse.json(responseBody, { status: 400 });
    }

    const { username } = usernameValidation.data;

    const existingUser = await db?.user.findFirst({
      where: { username },
    });

    if (!existingUser || !existingUser.email || !existingUser.password) {
      const responseBody: APIResponseInterface = {
        success: false,
        message: `We couldn\'t find an account with that info. Please double-check and try again.`,
      };

      return NextResponse.json(responseBody, { status: 404 });
    }

    const existingResetPasswordToken = await db.resetPasswordToken.findFirst({
      where: { email: existingUser?.email },
    });

    if (!existingResetPasswordToken || !existingResetPasswordToken.token) {
      const responseBody: APIResponseInterface = {
        success: false,
        message: 'Your enterd token is not valid.',
      };

      return NextResponse.json(responseBody, { status: 400 });
    }

    const isResetPasswordCodeExpired =
      existingResetPasswordToken?.expires < new Date();

    if (isResetPasswordCodeExpired) {
      const responseBody: APIResponseInterface = {
        success: false,
        message: `Your password reset token has expired.`,
      };

      return NextResponse.json(responseBody, { status: 400 });
    }

    const isResetPasswordCodeValid = await bcrypt.compare(
      tokenValidation.data.token,
      existingResetPasswordToken.token
    );

    if (!isResetPasswordCodeValid) {
      const responseBody: APIResponseInterface = {
        success: false,
        message: `Invalid token.`,
      };

      return NextResponse.json(responseBody, {
        status: 400,
      });
    }

    const body = await request.json();

    const passwordValidation = passwordSchema.safeParse(body);

    if (!passwordValidation.success) {
      const passwordErrors =
        passwordValidation.error.format().password?._errors;
      console.error(
        `Password validation failed: ${passwordErrors?.join(', ')}`
      );

      const responseBody: APIResponseInterface = {
        success: false,
        message:
          passwordErrors?.[0] || "Oops! That password doesn't look right.",
      };
      return NextResponse.json(responseBody, { status: 400 });
    }

    const { password } = passwordValidation.data;

    if (await bcrypt.compare(password, existingUser.password)) {
      const responseBody: APIResponseInterface = {
        success: false,
        message: `Your new password needs to be different from the old one.`,
      };
      return NextResponse.json(responseBody, {
        status: 400,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.$transaction([
      db.user.update({
        where: { id: existingUser.id },
        data: { password: hashedPassword },
      }),
      db.resetPasswordToken.delete({
        where: { id: existingResetPasswordToken.id },
      }),
    ]);

    const responseBody: APIResponseInterface = {
      success: true,
      message: `Password reset successfully.`,
    };

    return NextResponse.json(responseBody, {
      status: 200,
    });
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
