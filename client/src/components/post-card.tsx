import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart } from "lucide-react";
import type { Post } from "@shared/schema";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const getCategoryColor = (category: string) => {
    const colors = {
      JavaScript: "bg-blue-50 text-blue-600",
      Design: "bg-purple-50 text-purple-600",
      Career: "bg-green-50 text-green-600",
      Productivity: "bg-orange-50 text-orange-600",
      Mobile: "bg-pink-50 text-pink-600",
      Data: "bg-indigo-50 text-indigo-600",
    };
    return colors[category as keyof typeof colors] || "bg-gray-50 text-gray-600";
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-1">
      <img
        src={post.featuredImage || "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"}
        alt={post.title}
        className="w-full h-48 object-cover"
      />
      <CardContent className="p-6">
        <div className="flex items-center mb-3">
          <Badge className={getCategoryColor(post.category)}>
            {post.category}
          </Badge>
          <span className="text-slate-600 text-sm ml-4">
            {new Date(post.publishDate).toLocaleDateString()}
          </span>
        </div>
        <h3 className="text-xl font-semibold text-slate-900 mb-3 line-clamp-2">
          {post.title}
        </h3>
        <p className="text-slate-600 mb-4 line-clamp-3">
          {post.excerpt}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-slate-600 text-sm">5 min read</span>
            <div className="flex items-center space-x-1">
              <Heart className="w-4 h-4 text-red-500" />
              <span className="text-slate-600 text-sm">{post.likes}</span>
            </div>
          </div>
          <Link href={`/post/${post.id}`}>
            <Button variant="ghost" size="sm" className="text-blue-500 hover:text-blue-600">
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
