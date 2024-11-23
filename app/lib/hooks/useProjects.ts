import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Project } from "../types";

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await fetch("/api/projects");
      if (!res.ok) throw new Error("Failed to fetch projects");
      return res.json() as Promise<Project[]>;
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
      id: number;
      position: [number, number, number];
      rotation: [number, number, number];
    }) => {
      const res = await fetch(`/api/projects/${id}/transform`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ position, rotation }),
      });
      if (!res.ok) throw new Error("Failed to update project transform");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}
