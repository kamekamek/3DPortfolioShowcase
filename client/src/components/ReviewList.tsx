import type { Review } from "@/lib/hooks/useReviews";

interface ReviewListProps {
  reviews: Review[];
}

export default function ReviewList({ reviews }: ReviewListProps) {
  return (
    <div className="space-y-4">
      {reviews.length === 0 ? (
        <p className="text-muted-foreground">まだレビューはありません</p>
      ) : (
        reviews.map((review) => (
          <div key={review.id} className="border-t pt-4">
            <div className="flex items-center gap-2">
              <span className="text-yellow-500">{"★".repeat(review.rating)}</span>
              <span className="text-gray-500">{"☆".repeat(5 - review.rating)}</span>
            </div>
            <p className="text-sm mt-2">{review.comment}</p>
          </div>
        ))
      )}
    </div>
  );
}
