import { DefaultSession } from 'next-auth';
import { UserRole } from '@prisma/client';

declare module 'next/server' {
  interface NextRequest {
    auth: DefaultSession | null;
  }
}

declare module 'next-auth' {
  interface Session {
    user: {
      id?: string;
      username?: string;
      role?: UserRole;
    } & DefaultSession['user'];
  }
  interface User {
    id?: string;
    username?: string;
    role?: UserRole;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    username?: string;
    role?: UserRole;
  }
}
