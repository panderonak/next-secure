import { getUserByEmail, getUserVerifiedByUsername } from "@/data/user";
import { signUpSchema } from "@/schemas/sign-up-schema";
import APIResponseInterface from "@/types/APIResponseInterface";
import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";
import bcryptjs from "bcryptjs";
import { db } from "@/lib/db";
import { generateAndSaveVerificationCode } from "@/lib/verification-code";
import { verificationEmailSender } from "@/lib/emails/verification-email-sender";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const validateFields = signUpSchema.safeParse(body);

    if (!validateFields.success) {
      const responseBody: APIResponseInterface = {
        success: false,
        message:
          "It looks like some of the fields are incorrect. Please review your input and try again.",
      };

      return NextResponse.json(responseBody, { status: 400 });
    }

    const { email, password, username } = validateFields.data;

    const existingUserVerifiedByUsername =
      await getUserVerifiedByUsername(username);

    if (existingUserVerifiedByUsername) {
      const responseBody: APIResponseInterface = {
        success: false,
        message: `The username you’ve chosen is already taken. Please try a different one.`,
      };

      return NextResponse.json(responseBody, { status: 400 });
    }

    const existingUserByEmail = await getUserByEmail(email);

    const verificationCode = await generateAndSaveVerificationCode(email);

    if (existingUserByEmail) {
      if (existingUserByEmail.emailVerified) {
        const responseBody: APIResponseInterface = {
          success: false,
          message: `User already exists with this email.`,
        };

        return NextResponse.json(responseBody, { status: 400 });
      } else {
        const hashedPassword = await bcryptjs.hash(password, 10);

        await db.user.update({
          where: { email },
          data: {
            password: hashedPassword,
          },
        });
      }
    } else {
      const hashedPassword = await bcryptjs.hash(password, 10);

      await db.user.create({
        data: {
          username,
          password: hashedPassword,
          email,
        },
      });
    }
    const verificationEmailResponse = await verificationEmailSender(
      email,
      username,
      verificationCode
    );
    if (!verificationEmailResponse.success) {
      const responseBody: APIResponseInterface = {
        success: false,
        message: `${verificationEmailResponse.message}`,
      };

      return NextResponse.json(responseBody, { status: 500 });
    }

    const responseBody: APIResponseInterface = {
      success: true,
      message: `You're all set! Check your email to verify your account.`,
    };

    return NextResponse.json(responseBody, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      // Handle Zod validation errors

      const responseBody: APIResponseInterface = {
        success: false,
        message: `It looks like some of the input data isn’t valid. Please double-check and try again.`,
      };

      return NextResponse.json(responseBody, { status: 400 });
    }

    console.error(
      `An error occurred while registering the user: ${error}. Stack trace: ${
        error.stack || "No stack trace available"
      }`
    );

    const responseBody: APIResponseInterface = {
      success: false,
      message: `We're experiencing some issues while registering the user. Please try again shortly.`,
    };

    return NextResponse.json(responseBody, { status: 500 });
  }
}
