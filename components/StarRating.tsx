import React from 'react';
import { Star, StarHalf } from 'lucide-react';

interface StarRatingProps {
  rating: number; // 0 to 5
  size?: number; // pixel size
  interactive?: boolean;
  onChange?: (rating: number) => void;
  className?: string;
}

const StarRating: React.FC<StarRatingProps> = ({ 
  rating, 
  size = 14, 
  interactive = false, 
  onChange,
  className = ""
}) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  // Use obsidian color for black stars
  const colorClass = "text-obsidian fill-obsidian";
  const emptyColorClass = "text-stone-300";

  for (let i = 1; i <= 5; i++) {
    let StarIcon = Star;
    let styleClass = emptyColorClass;

    if (i <= fullStars) {
      styleClass = colorClass;
    } else if (i === fullStars + 1 && hasHalfStar && !interactive) {
      StarIcon = StarHalf; // Approximate half star using Lucide logic if available, or just use filled/empty logic
      // Note: Lucide React StarHalf might typically look different, for exact half filling SVG mapping is often better.
      // For this simplified version, we'll treat >= 0.5 as full for visual simplicity in pure "black star" requests unless standard stroke is used.
      // But let's stick to fill logic:
      styleClass = colorClass; // Treat half as filled for simple black star aesthetic or handle logic below.
    } 
    
    // Correction: Interactive mode shouldn't do half stars usually
    if (interactive) {
        styleClass = i <= rating ? colorClass : "text-stone-300";
    }

    stars.push(
      <button 
        key={i} 
        type="button"
        disabled={!interactive}
        onClick={() => onChange && onChange(i)}
        className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'} ${className}`}
      >
        <Star 
            size={size} 
            className={`${i <= rating || (i === fullStars + 1 && hasHalfStar) ? colorClass : 'text-stone-300'} stroke-[0]`} 
            fill={i <= rating || (i === fullStars + 1 && hasHalfStar) ? "currentColor" : "none"}
            stroke={i <= rating || (i === fullStars + 1 && hasHalfStar) ? "none" : "currentColor"}
            strokeWidth={1.5}
        />
      </button>
    );
  }

  return (
    <div className="flex items-center gap-0.5">
      {stars}
    </div>
  );
};

export default StarRating;