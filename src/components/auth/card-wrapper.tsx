"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Header } from "@/components/auth/header";
import { Socials } from "@/components/auth/socials";
import { BackButton } from "@/components/auth/back-button";

interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  backButtonPrompt: string;
  backButtonLabel: string;
  backButtonUrl: string;
  showSocialIcons?: boolean;
}

export function CardWrapper({
  children,
  headerLabel,
  backButtonPrompt,
  backButtonLabel,
  backButtonUrl,
  showSocialIcons,
}: CardWrapperProps) {
  return (
    <>
      <Card className="w-[400px] shadow-md">
        <CardHeader>
          <CardTitle>
            <Header label={headerLabel} />
          </CardTitle>
          <CardDescription>
            Deploy your new project in one-click.
          </CardDescription>
        </CardHeader>

        <CardContent>{children}</CardContent>
        {showSocialIcons && (
          <CardFooter>
            <Socials />
          </CardFooter>
        )}
        <CardFooter className="inline-flex justify-center w-full">
          <span className="font-normal text-sm">{backButtonPrompt}</span>
          <BackButton label={backButtonLabel} href={backButtonUrl} />
        </CardFooter>
      </Card>
    </>
  );
}
