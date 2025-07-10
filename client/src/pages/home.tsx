import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PostCard } from "@/components/post-card";
import { Plus, Grid, List } from "lucide-react";
import type { Post } from "@shared/schema";

export default function Home() {
  const { data: posts, isLoading } = useQuery<Post[]>({
    queryKey: ["/api/posts"],
  });

  const featuredPost = posts?.[0];
  const otherPosts = posts?.slice(1) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-slate-900">BlogSpace</h1>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-slate-900 transition-colors">
                Home
              </Link>
              <span className="text-gray-700 hover:text-slate-900 transition-colors cursor-pointer">
                About
              </span>
              <span className="text-gray-700 hover:text-slate-900 transition-colors cursor-pointer">
                Contact
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/editor">
                <Button className="bg-blue-500 hover:bg-blue-600">
                  <Plus className="w-4 h-4 mr-2" />
                  New Post
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Welcome to My Writing Space
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Thoughts, insights, and stories from my journey through technology, design, and life.
          </p>
        </section>

        {/* Featured Post */}
        {featuredPost && (
          <section className="mb-12">
            <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <img
                    src={featuredPost.featuredImage || "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"}
                    alt={featuredPost.title}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-8">
                  <div className="flex items-center mb-4">
                    <Badge variant="secondary" className="bg-blue-50 text-blue-600">
                      Featured
                    </Badge>
                    <span className="text-slate-600 text-sm ml-4">
                      {new Date(featuredPost.publishDate).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                    {featuredPost.title}
                  </h3>
                  <p className="text-slate-600 mb-6">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="text-slate-600 text-sm">8 min read</span>
                      <div className="flex items-center space-x-1">
                        <span className="text-red-500">♥</span>
                        <span className="text-slate-600 text-sm">{featuredPost.likes}</span>
                      </div>
                    </div>
                    <Link href={`/post/${featuredPost.id}`}>
                      <Button variant="ghost" className="text-blue-500 hover:text-blue-600">
                        Read More →
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          </section>
        )}

        {/* Recent Posts Grid */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Recent Posts</h2>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Grid className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}

          {/* Load More Button */}
          <div className="text-center mt-12">
            <Button variant="outline" className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white">
              Load More Posts
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
