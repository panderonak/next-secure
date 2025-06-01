import crypto from 'crypto';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export function generateVerificationCode() {
  return crypto.randomInt(100000, 999999).toString();
}

export async function generateAndSaveVerificationCode(
  email: string
): Promise<string> {
  // Delete any existing code for this email
  await db.verificationCode.deleteMany({ where: { email } });
  // Generate a new OTP
  const code = generateVerificationCode();
  const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  const hashedCode = await bcrypt.hash(code, 10); // Hash the code

  // Store in the database
  await db.verificationCode.create({
    data: { email, code: hashedCode, expires, createdAt: new Date() },
  });

  return code;
}
