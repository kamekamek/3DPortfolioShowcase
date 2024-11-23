import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import type { Project } from "@/lib/types";

interface ProjectDialogProps {
  project: Project;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ProjectDialog({
  project,
  open,
  onOpenChange,
}: ProjectDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{project.title}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4">
          <img
            src={project.image}
            alt={project.title}
            className="w-full aspect-video object-cover rounded-lg"
          />
          
          <p className="text-sm text-muted-foreground">
            {project.description}
          </p>
          
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <Badge key={tech} variant="secondary">
                {tech}
              </Badge>
            ))}
          </div>
          
          {project.link && (
            <Button asChild variant="outline">
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                Visit Project <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
