import { Button } from "@/components/ui/button";
import Link from "next/link";

interface BackButtonProps {
  label: string;
  href: string;
}

export function BackButton({ label, href }: BackButtonProps) {
  return (
    <Button variant={"link"} className="font-normal px-1" size={"sm"} asChild>
      <Link href={href} className="font-semibold">
        {label}
      </Link>
    </Button>
  );
}
