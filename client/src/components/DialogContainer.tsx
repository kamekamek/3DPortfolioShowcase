import { useProjectStore } from "@/lib/store";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { useProject } from "@/lib/hooks/useProject";

export default function DialogContainer() {
  const { selectedProject, setSelectedProject } = useProjectStore();
  const { data: project } = useProject(selectedProject?.id);

  if (!project) return null;

  return (
    <Dialog open={!!selectedProject} onOpenChange={(open) => !open && setSelectedProject(null)}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{project.title}</DialogTitle>
          <DialogDescription>
            作成者: {project.creatorName}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <img
            src={project.image}
            alt={project.title}
            className="w-full aspect-video object-cover rounded-lg"
          />
          <div>
            <h4 className="font-medium mb-2">説明</h4>
            <p className="text-sm text-muted-foreground">{project.description}</p>
          </div>
          <div>
            <h4 className="font-medium mb-2">使用技術</h4>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech: string) => (
                <span
                  key={tech}
                  className="px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
          {project.link && (
            <div>
              <h4 className="font-medium mb-2">プロジェクトリンク</h4>
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-500 hover:underline"
              >
                {project.link}
              </a>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
