import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { MarkdownEditor } from "@/components/markdown-editor";
import { ArrowLeft, Save, Eye } from "lucide-react";
import { Link } from "wouter";
import { toast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { insertPostSchema } from "@shared/schema";
import type { Post } from "@shared/schema";
import { z } from "zod";

const editorSchema = insertPostSchema.extend({
  publishDate: z.string().optional(),
});

type EditorFormData = z.infer<typeof editorSchema>;

export default function Editor() {
  const { id } = useParams<{ id?: string }>();
  const [, setLocation] = useLocation();
  const [isPreview, setIsPreview] = useState(false);
  const isEditing = Boolean(id);
  const postId = id ? parseInt(id) : undefined;

  const { data: post, isLoading } = useQuery<Post>({
    queryKey: ["/api/posts", postId],
    enabled: isEditing,
  });

  const form = useForm<EditorFormData>({
    resolver: zodResolver(editorSchema),
    defaultValues: {
      title: "",
      excerpt: "",
      content: "",
      category: "JavaScript",
      status: "draft",
      featuredImage: "",
    },
  });

  useEffect(() => {
    if (post) {
      form.reset({
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        category: post.category,
        status: post.status,
        featuredImage: post.featuredImage || "",
        publishDate: post.publishDate ? new Date(post.publishDate).toISOString().split('T')[0] : "",
      });
    }
  }, [post, form]);

  const createMutation = useMutation({
    mutationFn: async (data: EditorFormData) => {
      const postData = {
        ...data,
        publishDate: data.publishDate ? new Date(data.publishDate) : new Date(),
      };
      const response = await apiRequest("POST", "/api/posts", postData);
      return response.json();
    },
    onSuccess: (newPost) => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      toast({
        title: "Success!",
        description: "Post created successfully.",
      });
      setLocation(`/post/${newPost.id}`);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create post.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: EditorFormData) => {
      const postData = {
        ...data,
        publishDate: data.publishDate ? new Date(data.publishDate) : new Date(),
      };
      const response = await apiRequest("PUT", `/api/posts/${postId}`, postData);
      return response.json();
    },
    onSuccess: (updatedPost) => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/posts", postId] });
      toast({
        title: "Success!",
        description: "Post updated successfully.",
      });
      setLocation(`/post/${updatedPost.id}`);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update post.",
        variant: "destructive",
      });
    },
  });

  const saveDraftMutation = useMutation({
    mutationFn: async (data: EditorFormData) => {
      const postData = {
        ...data,
        status: "draft",
        publishDate: data.publishDate ? new Date(data.publishDate) : new Date(),
      };
      
      if (isEditing) {
        const response = await apiRequest("PUT", `/api/posts/${postId}`, postData);
        return response.json();
      } else {
        const response = await apiRequest("POST", "/api/posts", postData);
        return response.json();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      toast({
        title: "Draft saved!",
        description: "Your post has been saved as a draft.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save draft.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: EditorFormData) => {
    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const onSaveDraft = () => {
    const data = form.getValues();
    saveDraftMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-32 mb-6"></div>
            <div className="h-16 bg-gray-200 rounded mb-6"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Editor Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link href="/">
                  <Button variant="ghost" className="text-slate-600 hover:text-slate-900">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                  </Button>
                </Link>
                <h1 className="text-2xl font-bold text-slate-900">
                  {isEditing ? "Edit Post" : "Write New Post"}
                </h1>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setIsPreview(!isPreview)}
                  className="flex items-center space-x-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>{isPreview ? "Edit" : "Preview"}</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={onSaveDraft}
                  disabled={saveDraftMutation.isPending}
                  className="flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Draft</span>
                </Button>
                <Button
                  onClick={form.handleSubmit(onSubmit)}
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  {isEditing ? "Update" : "Publish"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Post Settings */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Post Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="JavaScript">JavaScript</SelectItem>
                          <SelectItem value="Design">Design</SelectItem>
                          <SelectItem value="Career">Career</SelectItem>
                          <SelectItem value="Productivity">Productivity</SelectItem>
                          <SelectItem value="Mobile">Mobile</SelectItem>
                          <SelectItem value="Data">Data</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="publishDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Publish Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Form>
          </CardContent>
        </Card>

        {/* Editor Interface */}
        <Card>
          <CardContent className="p-6">
            <Form {...form}>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Post title..."
                          className="text-2xl font-bold border-none shadow-none px-0 focus-visible:ring-0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Write a brief excerpt..."
                          className="resize-none border-none shadow-none px-0 focus-visible:ring-0"
                          rows={2}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="featuredImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Featured Image URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com/image.jpg"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <MarkdownEditor
                          value={field.value}
                          onChange={field.onChange}
                          isPreview={isPreview}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
