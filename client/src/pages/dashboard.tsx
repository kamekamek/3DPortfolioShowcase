import { useState } from "react";
import { useProjects, useCreateProject, useUpdateProject, useDeleteProject } from "../lib/hooks/useProjects";
import { useToast } from "../hooks/use-toast";
import { useAuth } from "../hooks/useAuth";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { ArrowLeft, Plus, Edit, Trash, LogOut } from "lucide-react";
import { Link, useLocation } from "wouter";
import ProjectForm from "../components/ProjectForm";

export default function Dashboard() {
  const { data: projects = [] } = useProjects();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const { toast } = useToast();
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();

  const handleSubmit = async (data: any) => {
    try {
      if (editingProject) {
        await updateProject.mutateAsync({
          id: editingProject.id,
          data: {
            ...data,
            technologies: Array.isArray(data.technologies) 
              ? data.technologies 
              : data.technologies.split(",").map((t: string) => t.trim()).filter(Boolean),
          },
        });
        toast({
          title: "更新完了",
          description: "プロジェクトが更新されました",
        });
      } else {
        await createProject.mutateAsync({
          ...data,
          user_id: user?.id,
          technologies: Array.isArray(data.technologies)
            ? data.technologies
            : data.technologies.split(",").map((t: string) => t.trim()).filter(Boolean),
        });
        toast({
          title: "作成完了",
          description: "プロジェクトが作成されました",
        });
      }
      setIsDialogOpen(false);
      setEditingProject(null);
    } catch (error: any) {
      toast({
        title: "エラー",
        description: error.message || "操作に失敗しました",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/auth");
    } catch (error: any) {
      toast({
        title: "エラー",
        description: error.message || "ログアウトに失敗しました",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              ギャラリーに戻る
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">プロジェクト管理</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> 新規プロジェクト
          </Button>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> ログアウト
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{project.title}</CardTitle>
                  <CardDescription>
                    作成者: {project.creatorName}
                    <br />
                    {project.description}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setEditingProject(project);
                      setIsDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => {
                      if (confirm("このプロジェクトを削除してもよろしいですか？")) {
                        deleteProject.mutate(project.id);
                      }
                    }}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <img
                src={project.image}
                alt={project.title}
                className="w-full aspect-video object-cover rounded-lg mb-4"
              />
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
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingProject ? "プロジェクトを編集" : "新規プロジェクト"}
            </DialogTitle>
          </DialogHeader>
          <ProjectForm
            onSubmit={handleSubmit}
            initialData={editingProject}
            isSubmitting={createProject.isPending || updateProject.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
