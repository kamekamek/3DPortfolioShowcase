import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase";
import type { Project } from "../types";

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects_with_users")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // データベースのカラム名とTypeScriptの型を一致させる
      return data.map((project: any) => ({
        ...project,
        position: project.position || [0, 0, 0],
        rotation: project.rotation || [0, 0, 0],
        createdAt: project.created_at,
        updatedAt: project.updated_at,
      })) as Project[];
    },
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<Project, "id" | "createdAt" | "updatedAt" | "creator_name">) => {
      // 現在のユーザーのIDを取得
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("ユーザーが認証されていません");

      // データベースのカラム名に合わせてデータを変換
      const dbData = {
        ...data,
        user_id: user.id,  // user_idを設定
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data: project, error } = await supabase
        .from("projects")
        .insert(dbData)
        .select()
        .single();

      if (error) throw error;

      // projects_with_usersビューから最新のデータを取得
      const { data: projectWithUser, error: viewError } = await supabase
        .from("projects_with_users")
        .select("*")
        .eq("id", project.id)
        .single();

      if (viewError) throw viewError;

      // レスポンスをTypeScriptの型に合わせて変換
      return {
        ...projectWithUser,
        createdAt: projectWithUser.created_at,
        updatedAt: projectWithUser.updated_at,
      } as Project;
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
      data: Partial<Omit<Project, "id" | "createdAt" | "updatedAt" | "creator_name">>;
    }) => {
      // データベースのカラム名に合わせてデータを変換
      const dbData = {
        ...data,
        updated_at: new Date().toISOString(),
      };

      const { data: project, error } = await supabase
        .from("projects")
        .update(dbData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      // projects_with_usersビューから最新のデータを取得
      const { data: projectWithUser, error: viewError } = await supabase
        .from("projects_with_users")
        .select("*")
        .eq("id", project.id)
        .single();

      if (viewError) throw viewError;

      // レスポンスをTypeScriptの型に合わせて変換
      return {
        ...projectWithUser,
        createdAt: projectWithUser.created_at,
        updatedAt: projectWithUser.updated_at,
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
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
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

      // projects_with_usersビューから最新のデータを取得
      const { data: projectWithUser, error: viewError } = await supabase
        .from("projects_with_users")
        .select("*")
        .eq("id", project.id)
        .single();

      if (viewError) throw viewError;

      return {
        ...projectWithUser,
        createdAt: projectWithUser.created_at,
        updatedAt: projectWithUser.updated_at,
      } as Project;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}
