import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Review {
  id: string;
  projectId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface CreateReviewData {
  projectId: string;
  rating: number;
  comment: string;
}

export function useReviews(projectId: string) {
  return useQuery({
    queryKey: ["reviews", projectId],
    queryFn: async () => {
      const res = await fetch(`/api/projects/${projectId}/reviews`);
      if (!res.ok) throw new Error("Failed to fetch reviews");
      return res.json() as Promise<Review[]>;
    },
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateReviewData) => {
      const res = await fetch(`/api/projects/${data.projectId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create review");
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reviews", variables.projectId] });
    },
  });
}
