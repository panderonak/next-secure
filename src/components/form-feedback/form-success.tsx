import { CheckCircledIcon } from "@radix-ui/react-icons";

interface FormSuccessProps {
  message?: string;
}

export function FormSuccess({ message }: FormSuccessProps) {
  if (!message) return null;

  return (
    <div className="bg-emerald-500/15 text-emerald-500 p-3 rounded-md flex justify-center items-center gap-x-2 text-sm">
      <CheckCircledIcon className="h-4 w-4" />
      <p>{message}</p>
    </div>
  );
}
