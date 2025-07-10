import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { CommentSection } from "@/components/comment-section";
import { SocialShare } from "@/components/social-share";
import { ArrowLeft, Heart, Bookmark } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import ReactMarkdown from "react-markdown";
import type { Post, Comment } from "@shared/schema";

export default function PostPage() {
  const { id } = useParams<{ id: string }>();
  const postId = parseInt(id || "0");

  const { data: post, isLoading: postLoading } = useQuery<Post>({
    queryKey: ["/api/posts", postId],
  });

  const { data: comments, isLoading: commentsLoading } = useQuery<Comment[]>({
    queryKey: ["/api/posts", postId, "comments"],
  });

  const likeMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", `/api/posts/${postId}/like`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts", postId] });
      toast({
        title: "Liked!",
        description: "You liked this post.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to like post.",
        variant: "destructive",
      });
    },
  });

  if (postLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-32 mb-4"></div>
            <div className="h-12 bg-gray-200 rounded mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-8"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h1>
            <p className="text-gray-600 mb-4">The post you're looking for doesn't exist.</p>
            <Link href="/">
              <Button>Return Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Post Header */}
        <header className="mb-8">
          <div className="flex items-center mb-4">
            <Link href="/">
              <Button variant="ghost" className="text-slate-600 hover:text-slate-900">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
          <div className="flex items-center mb-4">
            <Badge variant="secondary" className="bg-blue-50 text-blue-600">
              {post.category}
            </Badge>
            <span className="text-slate-600 text-sm ml-4">
              {new Date(post.publishDate).toLocaleDateString()}
            </span>
            <span className="text-slate-600 text-sm ml-4">8 min read</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            {post.title}
          </h1>
          <p className="text-xl text-slate-600 mb-6">
            {post.excerpt}
          </p>
          
          {/* Social Share Buttons */}
          <SocialShare 
            url={`${window.location.origin}/post/${post.id}`}
            title={post.title}
            description={post.excerpt}
          />

          {/* Featured Image */}
          {post.featuredImage && (
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-64 md:h-96 object-cover rounded-xl shadow-lg mb-8"
            />
          )}
        </header>

        {/* Post Content */}
        <div className="prose prose-lg max-w-none mb-8">
          <ReactMarkdown
            className="text-slate-700 leading-relaxed"
            components={{
              h1: ({ children }) => <h1 className="text-2xl font-bold text-slate-900 mt-8 mb-4">{children}</h1>,
              h2: ({ children }) => <h2 className="text-xl font-bold text-slate-900 mt-6 mb-3">{children}</h2>,
              h3: ({ children }) => <h3 className="text-lg font-semibold text-slate-900 mt-4 mb-2">{children}</h3>,
              p: ({ children }) => <p className="text-slate-700 mb-4">{children}</p>,
              ul: ({ children }) => <ul className="list-disc pl-6 mb-6 text-slate-700">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal pl-6 mb-6 text-slate-700">{children}</ol>,
              li: ({ children }) => <li className="mb-1">{children}</li>,
              code: ({ children }) => (
                <code className="bg-gray-900 text-gray-100 px-2 py-1 rounded text-sm font-mono">
                  {children}
                </code>
              ),
              pre: ({ children }) => (
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg mb-6 overflow-x-auto">
                  {children}
                </pre>
              ),
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        {/* Post Actions */}
        <div className="border-t border-gray-200 pt-8 mt-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => likeMutation.mutate()}
                disabled={likeMutation.isPending}
                className="flex items-center space-x-2 text-red-500 hover:text-red-600"
              >
                <Heart className="w-4 h-4" />
                <span>{post.likes} likes</span>
              </Button>
              <Button
                variant="ghost"
                className="flex items-center space-x-2 text-slate-600 hover:text-slate-900"
              >
                <Bookmark className="w-4 h-4" />
                <span>Save</span>
              </Button>
            </div>
            <SocialShare 
              url={`${window.location.origin}/post/${post.id}`}
              title={post.title}
              description={post.excerpt}
              compact
            />
          </div>
        </div>
      </article>

      {/* Comments Section */}
      <CommentSection postId={postId} comments={comments} isLoading={commentsLoading} />
    </div>
  );
}
