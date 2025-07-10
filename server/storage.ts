import { posts, comments, type Post, type Comment, type InsertPost, type InsertComment } from "@shared/schema";

export interface IStorage {
  // Post operations
  getAllPosts(): Promise<Post[]>;
  getPostById(id: number): Promise<Post | undefined>;
  createPost(post: InsertPost): Promise<Post>;
  updatePost(id: number, post: Partial<InsertPost>): Promise<Post | undefined>;
  deletePost(id: number): Promise<boolean>;
  likePost(id: number): Promise<Post | undefined>;
  
  // Comment operations
  getCommentsByPostId(postId: number): Promise<Comment[]>;
  createComment(comment: InsertComment): Promise<Comment>;
  
  // User operations (keeping existing)
  getUser(id: number): Promise<any>;
  getUserByUsername(username: string): Promise<any>;
  createUser(user: any): Promise<any>;
}

export class MemStorage implements IStorage {
  private posts: Map<number, Post>;
  private comments: Map<number, Comment>;
  private users: Map<number, any>;
  private currentPostId: number;
  private currentCommentId: number;
  private currentUserId: number;

  constructor() {
    this.posts = new Map();
    this.comments = new Map();
    this.users = new Map();
    this.currentPostId = 1;
    this.currentCommentId = 1;
    this.currentUserId = 1;
    
    // Initialize with some sample posts
    this.initializeSampleData();
  }

  private initializeSampleData() {
    const samplePosts: Post[] = [
      {
        id: 1,
        title: "Building Modern Web Applications with React and TypeScript",
        excerpt: "Exploring the latest patterns and best practices for creating scalable, maintainable web applications in 2024.",
        content: `# Introduction

In the rapidly evolving world of web development, React and TypeScript have emerged as the gold standard for building modern, scalable applications.

## Why React and TypeScript?

The combination of React's component-based architecture and TypeScript's static typing provides developers with:

- Enhanced developer experience with better IDE support
- Improved code quality through static type checking
- Better maintainability and refactoring capabilities
- Reduced runtime errors and improved debugging

## Modern React Patterns

### 1. Custom Hooks for State Logic

Custom hooks allow you to extract component logic into reusable functions:

\`\`\`javascript
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);
  const toggle = useCallback(() => setValue(prev => !prev), []);
  return [value, toggle];
}
\`\`\`

### 2. Compound Components

This pattern allows you to create flexible, reusable components that work together seamlessly.

## Performance Optimization

Performance is crucial for modern web applications. Here are key strategies:

- **Code Splitting:** Split your code into smaller chunks that load on demand
- **Memoization:** Use React.memo and useMemo to prevent unnecessary re-renders
- **Lazy Loading:** Load components only when they're needed
- **Bundle Analysis:** Regularly analyze your bundle size and optimize

## Conclusion

React and TypeScript continue to evolve, offering developers powerful tools for building modern web applications. By following these patterns and best practices, you'll be well-equipped to create scalable, maintainable applications that stand the test of time.`,
        category: "JavaScript",
        featuredImage: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        status: "published",
        publishDate: new Date("2024-03-15"),
        likes: 24,
        createdAt: new Date("2024-03-15"),
        updatedAt: new Date("2024-03-15"),
      },
      {
        id: 2,
        title: "Advanced JavaScript Patterns for Modern Development",
        excerpt: "Dive deep into advanced JavaScript patterns that will make your code more maintainable and performant.",
        content: "# Advanced JavaScript Patterns\n\nThis post explores advanced patterns...",
        category: "JavaScript",
        featuredImage: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        status: "published",
        publishDate: new Date("2024-03-10"),
        likes: 12,
        createdAt: new Date("2024-03-10"),
        updatedAt: new Date("2024-03-10"),
      },
      {
        id: 3,
        title: "Design Systems: Creating Consistency at Scale",
        excerpt: "Learn how to build and maintain design systems that scale across teams and products.",
        content: "# Design Systems\n\nCreating consistent design systems...",
        category: "Design",
        featuredImage: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        status: "published",
        publishDate: new Date("2024-03-08"),
        likes: 18,
        createdAt: new Date("2024-03-08"),
        updatedAt: new Date("2024-03-08"),
      },
    ];

    const sampleComments: Comment[] = [
      {
        id: 1,
        postId: 1,
        author: "John Doe",
        content: "Great article! I've been using React and TypeScript for a while now, and these patterns are exactly what I needed to improve my code quality. The custom hooks example is particularly useful.",
        createdAt: new Date("2024-03-15T10:00:00Z"),
      },
      {
        id: 2,
        postId: 1,
        author: "Sarah Miller",
        content: "The compound components pattern is something I've been struggling with. Your explanation makes it much clearer. Do you have any recommendations for when to use this pattern vs. regular prop drilling?",
        createdAt: new Date("2024-03-15T08:00:00Z"),
      },
      {
        id: 3,
        postId: 1,
        author: "Mike Kim",
        content: "Thanks for sharing this! I'm just starting with TypeScript and React, and this gives me a good roadmap to follow. The performance optimization section is gold.",
        createdAt: new Date("2024-03-15T06:00:00Z"),
      },
    ];

    samplePosts.forEach(post => {
      this.posts.set(post.id, post);
      this.currentPostId = Math.max(this.currentPostId, post.id + 1);
    });

    sampleComments.forEach(comment => {
      this.comments.set(comment.id, comment);
      this.currentCommentId = Math.max(this.currentCommentId, comment.id + 1);
    });
  }

  // Post operations
  async getAllPosts(): Promise<Post[]> {
    return Array.from(this.posts.values()).sort((a, b) => 
      new Date(b.publishDate || b.createdAt || new Date()).getTime() - new Date(a.publishDate || a.createdAt || new Date()).getTime()
    );
  }

  async getPostById(id: number): Promise<Post | undefined> {
    return this.posts.get(id);
  }

  async createPost(insertPost: InsertPost): Promise<Post> {
    const id = this.currentPostId++;
    const now = new Date();
    const post: Post = {
      ...insertPost,
      id,
      likes: 0,
      featuredImage: insertPost.featuredImage || null,
      status: insertPost.status || "draft",
      publishDate: insertPost.publishDate || null,
      createdAt: now,
      updatedAt: now,
    };
    this.posts.set(id, post);
    return post;
  }

  async updatePost(id: number, updateData: Partial<InsertPost>): Promise<Post | undefined> {
    const post = this.posts.get(id);
    if (!post) return undefined;
    
    const updatedPost: Post = {
      ...post,
      ...updateData,
      updatedAt: new Date(),
    };
    this.posts.set(id, updatedPost);
    return updatedPost;
  }

  async deletePost(id: number): Promise<boolean> {
    return this.posts.delete(id);
  }

  async likePost(id: number): Promise<Post | undefined> {
    const post = this.posts.get(id);
    if (!post) return undefined;
    
    const updatedPost: Post = {
      ...post,
      likes: (post.likes || 0) + 1,
      updatedAt: new Date(),
    };
    this.posts.set(id, updatedPost);
    return updatedPost;
  }

  // Comment operations
  async getCommentsByPostId(postId: number): Promise<Comment[]> {
    return Array.from(this.comments.values())
      .filter(comment => comment.postId === postId)
      .sort((a, b) => new Date(b.createdAt || new Date()).getTime() - new Date(a.createdAt || new Date()).getTime());
  }

  async createComment(insertComment: InsertComment): Promise<Comment> {
    const id = this.currentCommentId++;
    const comment: Comment = {
      ...insertComment,
      id,
      postId: insertComment.postId || null,
      createdAt: new Date(),
    };
    this.comments.set(id, comment);
    return comment;
  }

  // User operations (keeping existing implementation)
  async getUser(id: number): Promise<any> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<any> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: any): Promise<any> {
    const id = this.currentUserId++;
    const user: any = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
}

export const storage = new MemStorage();
