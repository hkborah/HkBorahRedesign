import * as React from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface LikeButtonProps {
  postId: string;
  initialLikes?: number;
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function LikeButton({ 
  postId, 
  initialLikes = 0,
  variant = "outline",
  size = "default",
  className = ""
}: LikeButtonProps) {
  const { toast } = useToast();
  const [likes, setLikes] = React.useState(initialLikes);
  const [isLiked, setIsLiked] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    const likedPosts = JSON.parse(localStorage.getItem("likedPosts") || "[]");
    setIsLiked(likedPosts.includes(postId));
  }, [postId]);

  React.useEffect(() => {
    setLikes(initialLikes);
  }, [initialLikes]);

  const handleLike = async () => {
    if (isLiked) {
      toast({
        title: "Already Liked",
        description: "You've already shown your appreciation for this post.",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch(`/api/blog/posts/${postId}/like`, {
        method: "POST",
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setLikes(data.likes);
        setIsLiked(true);
        
        const likedPosts = JSON.parse(localStorage.getItem("likedPosts") || "[]");
        likedPosts.push(postId);
        localStorage.setItem("likedPosts", JSON.stringify(likedPosts));
        
        toast({
          title: "Thanks!",
          description: "Your appreciation has been recorded.",
        });
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to like post",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to like post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      variant={variant}
      size={size}
      onClick={handleLike}
      disabled={isLoading}
      className={`border-slate-800 text-slate-400 hover:text-amber-500 hover:bg-slate-900 ${isLiked ? "text-red-500 border-red-500/30" : ""} ${className}`}
      data-testid="button-like"
    >
      <Heart className={`h-4 w-4 mr-2 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
      {isLoading ? "..." : likes > 0 ? likes : "Like"}
    </Button>
  );
}
