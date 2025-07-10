# BlogSpace Application

## Overview

BlogSpace is a full-stack blog application built with React, TypeScript, and Express. It features a modern design system using shadcn/ui components and provides functionality for creating, editing, and managing blog posts with a markdown editor, commenting system, and social sharing capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite for development and production builds
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **File Uploads**: Multer for handling image uploads
- **Session Management**: PostgreSQL-backed sessions

### Development Architecture
- **Monorepo Structure**: Shared schema and types between client and server
- **Hot Module Replacement**: Vite HMR for development
- **TypeScript**: Strict type checking across the entire application

## Key Components

### Data Layer
- **Schema Definition**: Located in `shared/schema.ts` with Drizzle ORM
- **Database Tables**: Posts and comments with proper relationships
- **Validation**: Zod schemas for runtime type validation
- **Storage Interface**: Abstracted storage layer supporting both in-memory and database storage

### Frontend Components
- **Pages**: Home, Post detail, Editor, and 404 pages
- **UI Components**: Complete shadcn/ui component library
- **Custom Components**: PostCard, CommentSection, SocialShare, MarkdownEditor
- **Hooks**: Custom hooks for mobile detection and toast notifications

### Backend Services
- **API Routes**: RESTful endpoints for posts and comments
- **File Upload**: Image upload handling with size and type validation
- **Error Handling**: Centralized error handling middleware
- **Logging**: Custom request logging for API endpoints

## Data Flow

1. **Post Creation**: Editor form → validation → API endpoint → database → cache invalidation
2. **Post Display**: Query API → cache → render with markdown processing
3. **Comments**: Form submission → validation → API → database → real-time updates
4. **File Uploads**: Multer processing → disk storage → URL generation

## External Dependencies

### Database
- **Neon Database**: Serverless PostgreSQL for production
- **Drizzle Kit**: Database migrations and schema management
- **Connection**: Environment-based DATABASE_URL configuration

### UI Framework
- **Radix UI**: Headless UI components for accessibility
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library for consistent iconography

### Development Tools
- **Replit Integration**: Runtime error overlay and development tools
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with autoprefixer

## Deployment Strategy

### Build Process
1. **Frontend**: Vite builds React app to `dist/public`
2. **Backend**: ESBuild bundles Express server to `dist/index.js`
3. **Assets**: Static file serving for uploads and build artifacts

### Production Configuration
- **Environment Variables**: DATABASE_URL for database connection
- **File Storage**: Local disk storage for uploaded images
- **Static Serving**: Express serves built frontend and uploaded files

### Development Setup
- **Hot Reload**: Vite HMR for frontend, tsx for backend
- **Database**: Drizzle migrations with `db:push` command
- **Type Checking**: Shared TypeScript configuration across client/server

The application uses a traditional full-stack architecture with clear separation between frontend and backend, while sharing types and validation schemas for consistency. The choice of technologies emphasizes developer experience, type safety, and modern web development practices.