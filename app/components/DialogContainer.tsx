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
        <DialogContent className="max-w-2xl bg-background text-foreground">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-foreground">
              {selectedProject.title}
            </DialogTitle>
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedProject.technologies.map((tech) => (
                <Badge key={tech} variant="secondary" className="text-secondary-foreground">
                  {tech}
                </Badge>
              ))}
            </div>
          </DialogHeader>

          <div className="relative aspect-video rounded-lg overflow-hidden my-4">
            <img
              src={selectedProject.image}
              alt={selectedProject.title}
              className="object-cover w-full h-full"
            />
          </div>

          <p className="text-foreground/90 text-base leading-relaxed">
            {selectedProject.description}
          </p>

          {selectedProject.link && (
            <div className="flex justify-end mt-4">
              <Button 
                variant="default"
                className="flex items-center gap-2 bg-primary hover:bg-primary/90"
                asChild
              >
                <a
                  href={selectedProject.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="w-4 h-4" />
                  <span>View Source</span>
                </a>
              </Button>
            </div>
          )}
        </DialogContent>
      )}
    </Dialog>
  );
}
