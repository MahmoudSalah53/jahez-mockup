type StarRatingProps = {
  rating: number;
  size?: "sm" | "md";
  showValue?: boolean;
};

export function StarRating({
  rating,
  size = "sm",
  showValue = true,
}: StarRatingProps) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.3;
  const starClass = size === "sm" ? "text-sm" : "text-base";

  return (
    <span className={`inline-flex items-center gap-1 ${starClass}`} dir="ltr">
      <span className="text-star tracking-tight" aria-hidden>
        {"★".repeat(full)}
        {hasHalf ? "☆" : ""}
        {"☆".repeat(Math.max(0, 5 - full - (hasHalf ? 1 : 0)))}
      </span>
      {showValue && (
        <span className="text-muted text-sm font-medium">{rating.toFixed(1)}</span>
      )}
      <span className="sr-only">التقييم {rating} من 5</span>
    </span>
  );
}
