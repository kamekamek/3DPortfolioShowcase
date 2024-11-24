import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCreateReview } from "@/lib/hooks/useReviews";
import { useToast } from "@/hooks/use-toast";

interface ReviewFormProps {
  projectId: string;
}

export default function ReviewForm({ projectId }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const createReview = useCreateReview();
  const { toast } = useToast();

  const handleSubmitReview = async () => {
    try {
      await createReview.mutateAsync({
        projectId,
        rating,
        comment,
      });
      setRating(0);
      setComment("");
      toast({
        title: "レビューを投稿しました",
        description: "ご意見ありがとうございます！",
      });
    } catch (error) {
      toast({
        title: "エラー",
        description: "レビューの投稿に失敗しました",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(star)}
            className={`text-2xl transition-colors ${
              star <= rating ? "text-yellow-500" : "text-gray-300"
            }`}
          >
            ★
          </button>
        ))}
      </div>
      <Textarea
        placeholder="レビューを書く..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <Button 
        onClick={handleSubmitReview}
        disabled={rating === 0 || !comment.trim() || createReview.isPending}
      >
        レビューを投稿
      </Button>
    </div>
  );
}
