import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase";
import type { ProjectWithUser } from "../types";

export function useProject(id: string | undefined) {
  return useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      if (!id) throw new Error("Project ID is required");

      const { data, error } = await supabase
        .from("projects_with_users")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      return {
        ...data,
        position: data.position || [0, 0, 0],
        rotation: data.rotation || [0, 0, 0],
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        creatorName: data.creator_name,
      } as ProjectWithUser;
    },
    enabled: !!id,
  });
} 