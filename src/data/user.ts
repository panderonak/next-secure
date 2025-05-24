import { db } from "@/lib/db";

export async function getUserByEmail(email: string) {
  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  } catch {
    return null;
  }
}

export async function getUserById(id: string) {
  try {
    const user = await db.user.findUnique({
      where: {
        id,
      },
    });
    return user;
  } catch {
    return null;
  }
}

export async function getUserVerifiedByUsername(username: string) {
  try {
    const user = await db.user.findUnique({
      where: {
        username,
      },
      select: {
        username: true,
        emailVerified: true,
      },
    });

    return user;
  } catch (error) {
    return null;
  }
}
