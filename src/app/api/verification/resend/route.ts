import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateAndSaveVerificationCode } from "@/lib/verification-code";
import { verificationEmailSender } from "@/lib/emails/verification-email-sender";
import APIResponseInterface from "@/types/APIResponseInterface";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { username } = await request.json();

    const user = await db.user.findFirst({ where: { username } });

    if (!user || !user.email) {
      const responseBody: APIResponseInterface = {
        success: false,
        message: `We couldn\'t find an account with that info. Please double-check and try again.`,
      };

      return NextResponse.json(responseBody, { status: 404 });
    }
    const verificationCode = await generateAndSaveVerificationCode(user.email);

    const verificationEmailResponse = await verificationEmailSender(
      user.email,
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
      message: `Code has been successfully resent.`,
    };

    return NextResponse.json(responseBody, { status: 200 });
  } catch (error: any) {
    const responseBody: APIResponseInterface = {
      success: false,
      message: `Unable to resend OTP. Please try again.`,
    };

    return NextResponse.json(responseBody, { status: 500 });
  }
}
