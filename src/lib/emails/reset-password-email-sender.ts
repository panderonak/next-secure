import { resend } from '@/lib/resend';
import ResetPasswordEmail from '@/components/emails/reset-password-email';
import APIResponseInterface from '@/types/APIResponseInterface';

export async function resetPasswordEmailSender(
  email: string,
  username: string,
  resetPasswordToken: string
): Promise<APIResponseInterface> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const resetPasswordLink = `${baseUrl}/reset-password/${encodeURIComponent(username)}?token=${encodeURIComponent(resetPasswordToken)}`;

  try {
    await resend.emails.send({
      from: 'Paradis <onboarding@resend.dev>',
      to: email,
      subject: 'Here’s Your Paradis Password Reset Link',
      react: ResetPasswordEmail({ username, resetPasswordLink }),
    });

    return {
      success: true,
      message:
        "We've sent you a link to reset your password. Please check your inbox.",
    };
  } catch (error) {
    console.error(`Error sending verification email. Details: ${error}`);

    return {
      success: false,
      message:
        'Oops! We couldn’t send the reset email right now. Please try again shortly.',
    };
  }
}
