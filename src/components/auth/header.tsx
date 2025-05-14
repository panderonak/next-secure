import { Roboto } from "next/font/google";
import { cn } from "@/lib/utils";

const font = Roboto({
  subsets: ["latin"],
  weight: ["600"],
});

interface HeaderProps {
  label: string;
}

export function Header({ label }: HeaderProps) {
  return (
    <div className="w-full flex flex-col gap-y-5 items-center justify-center">
      <h1 className={cn("text-3xl font-semibold", font.className)}>
        Authentication
      </h1>
      <p className="text-muted-foreground text-sm">{label}</p>
    </div>
  );
}
