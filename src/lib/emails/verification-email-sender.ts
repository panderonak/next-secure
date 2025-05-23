import { resend } from "@/lib/resend";
import VerificationEmail from "@/components/emails/verification-code-email";
import APIResponseInterface from "@/types/APIResponseInterface";

export async function verificationEmailSender(
  email: string,
  username: string,
  verificationCode: string
): Promise<APIResponseInterface> {
  try {
    await resend.emails.send({
      from: "Paradis <onboarding@resend.dev>",
      to: email,
      subject: "Here’s Your Paradis Code!",
      react: VerificationEmail({ username, verificationCode }),
    });

    return {
      success: true,
      message: "We've sent you a verification email. Check your inbox!",
    };
  } catch (error) {
    console.error(`Error sending verification email. Details: ${error}`);

    return {
      success: false,
      message: `We’re having trouble sending the verification email. Please try again in a few moments.`,
    };
  }
}
