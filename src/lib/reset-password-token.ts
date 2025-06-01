import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export async function generateAndSaveResetPasswordToken(
  email: string
): Promise<string> {
  const token = uuidv4();

  await db.resetPasswordToken.deleteMany({ where: { email } });

  const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  const hashedToken = await bcrypt.hash(token, 10); // Hash the token

  // Store in the database
  await db.resetPasswordToken.create({
    data: { email, token: hashedToken, expires, createdAt: new Date() },
  });

  return token;
}
