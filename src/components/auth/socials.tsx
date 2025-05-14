import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";

export function Socials() {
  return (
    <div className="flex items-center w-full gap-x-2">
      <Button
        size={"lg"}
        variant={"outline"}
        className="w-1/2 rounded-3xl cursor-pointer"
      >
        <FcGoogle className="h-5 w-5" />
        <span>Google</span>
      </Button>
      <Button
        size={"lg"}
        variant={"outline"}
        className="w-1/2 rounded-3xl cursor-pointer"
      >
        <FaGithub className="h-5 w-5" />
        <span>Git Hub</span>
      </Button>
    </div>
  );
}
