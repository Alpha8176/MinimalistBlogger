import { Button } from "@/components/ui/button";
import { Twitter, Facebook, Linkedin, Link } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface SocialShareProps {
  url: string;
  title: string;
  description: string;
  compact?: boolean;
}

export function SocialShare({ url, title, description, compact = false }: SocialShareProps) {
  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Copied!",
        description: "Link copied to clipboard.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy link.",
        variant: "destructive",
      });
    }
  };

  const openShare = (platform: keyof typeof shareUrls) => {
    window.open(shareUrls[platform], "_blank", "width=600,height=400");
  };

  if (compact) {
    return (
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => openShare("twitter")}
          className="text-blue-500 hover:text-blue-600"
        >
          <Twitter className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => openShare("facebook")}
          className="text-blue-700 hover:text-blue-800"
        >
          <Facebook className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => openShare("linkedin")}
          className="text-blue-600 hover:text-blue-700"
        >
          <Linkedin className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={copyToClipboard}
          className="text-slate-600 hover:text-slate-700"
        >
          <Link className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4 mb-8">
      <span className="text-slate-600 text-sm">Share:</span>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => openShare("twitter")}
        className="text-blue-500 hover:text-blue-600"
      >
        <Twitter className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => openShare("facebook")}
        className="text-blue-700 hover:text-blue-800"
      >
        <Facebook className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => openShare("linkedin")}
        className="text-blue-600 hover:text-blue-700"
      >
        <Linkedin className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={copyToClipboard}
        className="text-slate-600 hover:text-slate-700"
      >
        <Link className="w-4 h-4" />
      </Button>
    </div>
  );
}
