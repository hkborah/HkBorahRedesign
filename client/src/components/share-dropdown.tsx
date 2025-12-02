import * as React from "react";
import { Share2, Linkedin, Twitter, Facebook, Instagram, Link, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface ShareDropdownProps {
  title: string;
  url?: string;
  excerpt?: string;
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function ShareDropdown({ 
  title, 
  url, 
  excerpt = "", 
  variant = "outline",
  size = "default",
  className = ""
}: ShareDropdownProps) {
  const { toast } = useToast();
  const [copied, setCopied] = React.useState(false);
  const [shareUrl, setShareUrl] = React.useState(url || "");
  
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      if (!url) {
        setShareUrl(window.location.href);
      } else if (url.startsWith("/")) {
        setShareUrl(`${window.location.origin}${url}`);
      } else {
        setShareUrl(url);
      }
    }
  }, [url]);
  
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = {
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    instagram: null, // Instagram doesn't support direct URL sharing
  };

  const handleShare = (platform: keyof typeof shareLinks) => {
    const link = shareLinks[platform];
    if (link) {
      window.open(link, "_blank", "width=600,height=400");
    } else if (platform === "instagram") {
      handleCopyLink();
      toast({
        title: "Link Copied",
        description: "Instagram doesn't support direct sharing. The link has been copied - paste it in your Instagram bio or story.",
      });
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({
        title: "Link Copied",
        description: "The link has been copied to your clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive",
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant} 
          size={size}
          className={`border-slate-800 text-slate-400 hover:text-amber-500 hover:bg-slate-900 ${className}`}
          data-testid="button-share"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-48 bg-slate-900 border-slate-800"
      >
        <DropdownMenuItem 
          onClick={() => handleShare("linkedin")}
          className="cursor-pointer text-slate-300 hover:text-amber-500 hover:bg-slate-800 focus:bg-slate-800 focus:text-amber-500"
          data-testid="share-linkedin"
        >
          <Linkedin className="h-4 w-4 mr-2 text-[#0A66C2]" />
          LinkedIn
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleShare("twitter")}
          className="cursor-pointer text-slate-300 hover:text-amber-500 hover:bg-slate-800 focus:bg-slate-800 focus:text-amber-500"
          data-testid="share-twitter"
        >
          <Twitter className="h-4 w-4 mr-2" />
          X (Twitter)
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleShare("facebook")}
          className="cursor-pointer text-slate-300 hover:text-amber-500 hover:bg-slate-800 focus:bg-slate-800 focus:text-amber-500"
          data-testid="share-facebook"
        >
          <Facebook className="h-4 w-4 mr-2 text-[#1877F2]" />
          Facebook
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleShare("instagram")}
          className="cursor-pointer text-slate-300 hover:text-amber-500 hover:bg-slate-800 focus:bg-slate-800 focus:text-amber-500"
          data-testid="share-instagram"
        >
          <Instagram className="h-4 w-4 mr-2 text-[#E4405F]" />
          Instagram
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={handleCopyLink}
          className="cursor-pointer text-slate-300 hover:text-amber-500 hover:bg-slate-800 focus:bg-slate-800 focus:text-amber-500"
          data-testid="share-copy-link"
        >
          {copied ? (
            <Check className="h-4 w-4 mr-2 text-green-500" />
          ) : (
            <Link className="h-4 w-4 mr-2" />
          )}
          Copy Link
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
