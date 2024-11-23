import { useProjectStore } from "@/lib/store";
import ProjectDialog from "./ProjectDialog";

export default function DialogContainer() {
  const { selectedProject, setSelectedProject } = useProjectStore();

  return (
    selectedProject && (
      <ProjectDialog
        project={selectedProject}
        open={!!selectedProject}
        onOpenChange={(open) => !open && setSelectedProject(null)}
      />
    )
  );
}
