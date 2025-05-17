import { DefaultSession } from "next-auth";
import type { NextRequest } from "next/server";

declare module "next/server" {
  interface NextRequest {
    auth: DefaultSession | null;
  }
}
