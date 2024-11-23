import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

export default function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
        3D Portfolio
      </h1>
      <div className="flex gap-4">
        <Button variant="outline" size="icon">
          <Github className="h-4 w-4" />
        </Button>
      </div>
    </nav>
  );
}
