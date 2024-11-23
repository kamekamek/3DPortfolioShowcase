"use client";

import { useProjectStore } from "@/app/lib/store";
import { Badge } from "@/app/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Github } from "lucide-react";

export default function DialogContainer() {
  const selectedProject = useProjectStore((state) => state.selectedProject);
  const setSelectedProject = useProjectStore((state) => state.setSelectedProject);

  return (
    <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
      {selectedProject && (
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {selectedProject.title}
            </DialogTitle>
            <DialogDescription className="flex flex-wrap gap-2 mt-2">
              {selectedProject.technologies.map((tech) => (
                <Badge key={tech} variant="secondary">
                  {tech}
                </Badge>
              ))}
            </DialogDescription>
          </DialogHeader>

          <div className="relative aspect-video rounded-lg overflow-hidden">
            <img
              src={selectedProject.image}
              alt={selectedProject.title}
              className="object-cover"
            />
          </div>

          <p className="text-muted-foreground">
            {selectedProject.description}
          </p>

          {selectedProject.link && (
            <div className="flex justify-end">
              <Button asChild>
                <a
                  href={selectedProject.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Github className="w-4 h-4" />
                  View Source
                </a>
              </Button>
            </div>
          )}
        </DialogContent>
      )}
    </Dialog>
  );
}
