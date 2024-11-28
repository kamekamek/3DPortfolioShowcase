import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase";
import type { Project, ProjectWithUser } from "../types";

export function useProjects(userId?: string, isAdmin?: boolean) {
  return useQuery({
    queryKey: ["projects", userId, isAdmin],
    queryFn: async () => {
      // まず、現在のユーザーの管理者権限を確認
      if (userId) {
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("is_admin")
          .eq("id", userId)
          .single();

        if (userError) throw userError;

        // ユーザーが管理者の場合は全てのプロジェクトを取得
        const query = supabase
          .from("projects_with_users")
          .select("*")
          .order("created_at", { ascending: false });

        // 管理者でない場合は、自分のプロジェクトのみを取得
        if (!userData.is_admin) {
          query.eq("user_id", userId);
        }

        const { data, error } = await query;
        if (error) throw error;

        return data.map((project: any) => ({
          ...project,
          position: project.position || [0, 0, 0],
          rotation: project.rotation || [0, 0, 0],
          createdAt: project.created_at,
          updatedAt: project.updated_at,
          creatorName: project.creator_name,
        })) as ProjectWithUser[];
      }

      // userIdがない場合は全てのプロジェクトを取得（ホーム画面用）
      const { data, error } = await supabase
        .from("projects_with_users")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      return data.map((project: any) => ({
        ...project,
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
      // 現在のユーザーのIDを取得
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("ユーザーが認証されていません");

      // データベースのカラム名に合わせてデータを変換
      const dbData = {
        ...data,
        user_id: user.id,
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
      // 現在のユーザーの権限を確認
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("認証が必要です");

      // ユーザーの管理者権限を確認
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("is_admin")
        .eq("id", user.id)
        .single();

      if (userError) throw userError;

      // プロジェクトの所有者を確認
      const { data: project, error: projectError } = await supabase
        .from("projects")
        .select("user_id")
        .eq("id", id)
        .single();

      if (projectError) throw projectError;

      // 管理者または所有者でない場合はエラー
      if (!userData.is_admin && project.user_id !== user.id) {
        throw new Error("このプロジェクトを編集する権限がありません");
      }

      // 更新処理
      const dbData = {
        ...data,
        updated_at: new Date().toISOString(),
      };

      const { data: updatedProject, error } = await supabase
        .from("projects")
        .update(dbData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      return updatedProject;
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
      // 現在のユーザーの権限を確認
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("認証が必要です");

      // ユーザーの管理者権限を確認
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("is_admin")
        .eq("id", user.id)
        .single();

      if (userError) throw userError;

      // プロジェクトの所有者を確認
      const { data: project, error: projectError } = await supabase
        .from("projects")
        .select("user_id")
        .eq("id", id)
        .single();

      if (projectError) throw projectError;

      // 管理者または所有者でない場合はエラー
      if (!userData.is_admin && project.user_id !== user.id) {
        throw new Error("このプロジェクトを削除する権限がありません");
      }

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
