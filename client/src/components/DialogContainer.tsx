import { useProjectStore } from "@/lib/store";
import ProjectDialog from "./ProjectDialog";

export default function DialogContainer() {
  const { selectedProject, setSelectedProject } = useProjectStore();

  return (
    <div className="fixed inset-0 pointer-events-none">
      <div className="pointer-events-auto">
        {selectedProject && (
          <ProjectDialog
            project={selectedProject}
            open={!!selectedProject}
            onOpenChange={(open) => !open && setSelectedProject(null)}
          />
        )}
      </div>
    </div>
  );
}
