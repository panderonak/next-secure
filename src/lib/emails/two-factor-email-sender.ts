import { resend } from '@/lib/resend';
import APIResponseInterface from '@/types/APIResponseInterface';
import TwoFactorCodeEmail from '@/components/emails/two-factor-email';

export async function resetPasswordEmailSender(
  email: string,
  username: string,
  twoFactorCode: string
): Promise<APIResponseInterface> {
  try {
    await resend.emails.send({
      from: 'Paradis <onboarding@resend.dev>',
      to: email,
      subject: 'Here’s Your Paradis Sign-In Verification Code',

      react: TwoFactorCodeEmail({ username, twoFactorCode }),
    });

    return {
      success: true,
      message: "We've sent you a verification code. Please check your inbox.",
    };
  } catch (error) {
    console.error(
      `Error sending two factor verification code email. Details: ${error}`
    );

    return {
      success: false,
      message: 'Couldn’t send the verification code. Please try again.',
    };
  }
}
