import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import { Link } from "wouter";

export default function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4">
      <Link href="/">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent cursor-pointer">
          3D Portfolio
        </h1>
      </Link>
      <div className="flex gap-4">
        <Link href="/dashboard">
          <Button variant="outline">管理画面</Button>
        </Link>
        <Button variant="outline" size="icon">
          <Github className="h-4 w-4" />
        </Button>
      </div>
    </nav>
  );
}
