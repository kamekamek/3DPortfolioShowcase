import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase";
import type { Project, ProjectWithUser } from "../types";

export function useProjects(userId?: string) {
  return useQuery({
    queryKey: ["projects", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects_with_users")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      return data.map((project: any) => ({
        ...project,
        userId: project.user_id,
        position: project.position || [0, 0, 0],
        rotation: project.rotation || [0, 0, 0],
        createdAt: project.created_at,
        updatedAt: project.updated_at,
        creatorName: project.creator_name,
      })) as ProjectWithUser[];
    },
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<Project, "id" | "createdAt" | "updatedAt">) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("ユーザーが認証されていません");

      const dbData = {
        user_id: user.id,
        title: data.title,
        description: data.description,
        image: data.image,
        link: data.link,
        technologies: data.technologies,
        position: data.position,
        rotation: data.rotation,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data: project, error } = await supabase
        .from("projects")
        .insert(dbData)
        .select()
        .single();

      if (error) throw error;

      const { data: projectWithUser, error: viewError } = await supabase
        .from("projects_with_users")
        .select("*")
        .eq("id", project.id)
        .single();

      if (viewError) throw viewError;

      return {
        ...projectWithUser,
        userId: projectWithUser.user_id,
        createdAt: projectWithUser.created_at,
        updatedAt: projectWithUser.updated_at,
        creatorName: projectWithUser.creator_name,
      } as ProjectWithUser;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Omit<Project, "id" | "createdAt" | "updatedAt">>;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("認証が必要です");

      const dbData = {
        title: data.title,
        description: data.description,
        image: data.image,
        link: data.link,
        technologies: data.technologies,
        updated_at: new Date().toISOString(),
      };

      const { data: updatedProject, error } = await supabase
        .from("projects")
        .update(dbData)
        .eq("id", id)
        .eq("user_id", user.id) // 所有者チェックを追加
        .select()
        .single();

      if (error) {
        console.error("Update error:", error);
        throw new Error("プロジェクトの更新に失敗しました");
      }

      return {
        ...updatedProject,
        userId: updatedProject.user_id,
        createdAt: updatedProject.created_at,
        updatedAt: updatedProject.updated_at,
      } as Project;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("認証が必要です");

      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id); // 所有者チェックを追加

      if (error) {
        console.error("Delete error:", error);
        throw new Error("プロジェクトの削除に失敗しました");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useUpdateProjectTransform() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      position,
      rotation,
    }: {
      id: string;
      position: [number, number, number];
      rotation: [number, number, number];
    }) => {
      const { data: project, error } = await supabase
        .from("projects")
        .update({
          position,
          rotation,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      const { data: projectWithUser, error: viewError } = await supabase
        .from("projects_with_users")
        .select("*")
        .eq("id", project.id)
        .single();

      if (viewError) throw viewError;

      return {
        ...projectWithUser,
        userId: projectWithUser.user_id,
        createdAt: projectWithUser.created_at,
        updatedAt: projectWithUser.updated_at,
      } as Project;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}
