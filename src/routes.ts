// An array of routes that are accessible to the public.
// These routes do not require authentication.
export const publicRoutes: string[] = ['/'];

// An array of routes that are used for authentication.
// These routes will redirect authenticated users to "/settings".
export const authRoutes: string[] = [
  '/sign-in',
  '/sign-up',
  '/verification(?:/[^/]+)?',
  '/reset-password(?:/[^/]+)?',
];

// The prefix for API authentication routes.
// Routes that start with this prefix are used for API authentication purposes.
export const APIAuthPrefix: string = '/api';

// The default redirect path after SIGN UP.
export const DEFAULT_SIGNIN_REDIRECT: string = '/settings';
