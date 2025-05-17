import authConfig from "@/auth.config";
import NextAuth from "next-auth";
import {
  APIAuthPrefix,
  DEFAULT_SIGNIN_REDIRECT,
  authRoutes,
  publicRoutes,
} from "@/routes";
import { NextRequest, NextResponse } from "next/server";

export const { auth } = NextAuth(authConfig);

export default auth(async function middleware(request: NextRequest) {
  const { nextUrl } = request;
  const isAuthenticated = !!request.auth;

  const isAPIAuthRoute = nextUrl.pathname.startsWith(APIAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isAPIAuthRoute) {
    return NextResponse.next();
  }

  if (isAuthRoute) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL(DEFAULT_SIGNIN_REDIRECT, nextUrl));
    }

    return NextResponse.next();
  }

  if (!isAuthenticated && !isPublicRoute) {
    return NextResponse.redirect(new URL("/sign-in", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
