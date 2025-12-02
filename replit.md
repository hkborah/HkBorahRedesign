# Overview

This is a full-stack web application built with React (frontend) and Express (backend), featuring a PostgreSQL database managed through Drizzle ORM. The application uses shadcn/ui components for the interface and is deployed on Replit's infrastructure. The project appears to be a platform for AI-driven startup consulting or a digital assistant service, based on the attached documentation about startup frameworks and methodologies.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The frontend is built with modern React and Vite, utilizing a component-based architecture:

- **UI Framework**: React with TypeScript, using Vite as the build tool and development server
- **Styling**: Tailwind CSS with shadcn/ui component library (New York variant)
- **Component Library**: Extensive use of Radix UI primitives for accessible, unstyled components
- **State Management**: TanStack Query (React Query) for server state management
- **Form Handling**: React Hook Form with resolvers for validation
- **Icon System**: Lucide icons

The frontend follows a standard SPA architecture with client-side routing. Components are organized using path aliases (`@/` for client source, `@shared/` for shared types/schemas). The build outputs to `dist/public` for production deployment.

**Design Decision**: The choice of shadcn/ui provides a balance between customization and speed - components are copied into the project rather than imported from a package, allowing full control while maintaining consistency.

## Backend Architecture

The backend uses Express.js with TypeScript in an ES modules setup:

- **Runtime**: Node.js with TypeScript (tsx for development)
- **Framework**: Express.js for HTTP server and routing
- **Session Management**: PostgreSQL-backed sessions using connect-pg-simple
- **CORS**: Configured for cross-origin requests
- **API Design**: RESTful architecture (based on project naming)

The server code lives in the `/server` directory and is bundled for production deployment. Development uses tsx for hot reloading.

**Design Decision**: Express was chosen for its simplicity and flexibility, making it easy to iterate quickly while maintaining the ability to scale. PostgreSQL sessions provide stateful authentication without requiring additional infrastructure.

## Database Architecture

Data persistence uses PostgreSQL with Drizzle ORM:

- **Database**: PostgreSQL (via Neon serverless driver)
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Location**: `shared/schema.ts` (shared between client and server)
- **Migrations**: Managed via Drizzle Kit, output to `/migrations`

The schema is co-located in the `shared/` directory, enabling type sharing between frontend and backend. This ensures consistency in data types across the full stack.

**Design Decision**: Drizzle was selected for its TypeScript-first approach and lightweight nature. The Neon serverless driver enables deployment on serverless platforms without connection pooling concerns. The shared schema approach reduces duplication and keeps types synchronized.

## Build and Deployment

The application uses a custom build process:

- **Development**: Separate dev servers for client (Vite on port 5000) and server (tsx)
- **Production Build**: Custom build script (`script/build.ts`) bundles both client and server
- **Output**: Client assets to `dist/public`, server to `dist/index.cjs`
- **Deployment**: Replit-optimized with dev banners and cartographer plugins

**Design Decision**: The separation of client and server builds allows independent scaling and deployment strategies. The CommonJS output for the server ensures compatibility with various Node.js environments.

## Development Tools and Plugins

Several custom Vite plugins enhance the development experience:

- **Meta Images Plugin**: Automatically updates OpenGraph images with the correct Replit deployment URL
- **Runtime Error Overlay**: Displays runtime errors during development (@replit/vite-plugin-runtime-error-modal)
- **Cartographer**: Development tool for Replit environment
- **Dev Banner**: Development environment indicator

# External Dependencies

## Third-Party Services

- **Neon Database**: Serverless PostgreSQL hosting (via `@neondatabase/serverless`)
- **Replit Infrastructure**: Deployment platform with custom plugins for development and production

## Key Libraries and Frameworks

### Frontend
- **React Query** (@tanstack/react-query): Server state management and caching
- **Radix UI**: Comprehensive set of accessible component primitives
- **React Hook Form** (@hookform/resolvers): Form validation and management
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Component collection built on Radix UI and Tailwind
- **date-fns**: Date manipulation library
- **cmdk**: Command palette component

### Backend
- **Express**: Web application framework
- **Drizzle ORM**: TypeScript ORM for PostgreSQL
- **connect-pg-simple**: PostgreSQL session store for Express
- **cors**: Cross-Origin Resource Sharing middleware

### Development
- **Vite**: Build tool and development server
- **TypeScript**: Type safety across the stack
- **tsx**: TypeScript execution for Node.js
- **Drizzle Kit**: Database migration toolkit

## Configuration and Tooling

- **PostCSS**: CSS processing with Tailwind and Autoprefixer
- **Path Aliases**: Configured for clean imports (`@/`, `@shared/`, `@assets/`)
- **Environment Variables**: `DATABASE_URL` required for database connection