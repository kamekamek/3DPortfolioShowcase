import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";
import { useReviews } from "@/lib/hooks/useReviews";
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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{project.title}</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {project.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4">
          <img
            src={project.image}
            alt={project.title}
            className="w-full aspect-video object-cover rounded-lg"
          />
          
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

        <Tabs defaultValue="details" className="mt-6">
          <TabsList>
            <TabsTrigger value="details">詳細</TabsTrigger>
            <TabsTrigger value="reviews">レビュー</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <div className="mt-4">
              <h3 className="font-semibold mb-2">技術スタック</h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <div
                    key={tech}
                    className="px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                  >
                    {tech}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-4">
            <ReviewForm projectId={project.id} />
            <div className="mt-8">
              <h3 className="font-semibold mb-4">レビュー一覧</h3>
              <ReviewList reviews={useReviews(project.id).data || []} />
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
