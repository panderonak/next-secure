"use client";

import React from "react";
import { VerificationForm } from "@/components/auth/verification-form";
import { useParams } from "next/navigation";

export default function page() {
  const params = useParams<{ username: string }>();

  return <VerificationForm username={params.username} />;
}
