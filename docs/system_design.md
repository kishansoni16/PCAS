# Placement Cell Automation System (PCAS) - System Design & Architecture

## 1. Overview
The Placement Cell Automation System (PCAS) is a comprehensive platform designed to streamline the campus recruitment process. It serves three primary user roles:
- **Students**: Can view eligible jobs, apply for positions, track application statuses, and manage their academic profiles.
- **Admins**: Can manage student registries, oversee all job drives, generate placement reports, and monitor overall placement metrics.
- **Recruiters**: Can post job openings, review student applications, and shortlist/select candidates.

## 2. Architecture
The project will be structured as a standard **Next.js** application.

### Technology Stack
- **Frontend**: Next.js (App Router), React, Vanilla CSS (preserving the original design system and CSS variables), TypeScript.
- **Backend**: Next.js API Routes (Node.js edge/server runtime) with strictly enforced **API Versioning** (e.g., `/api/v1/`).
- **Database**: PostgreSQL (relational database suitable for structured data like users, jobs, and applications).
- **ORM**: Prisma ORM for type-safe database interactions.
- **Authentication**: NextAuth.js (Auth.js) for handling role-based login (Student, Admin, Recruiter).

### Standard Next.js Structure
```text
pcas-nextjs/
├── prisma/                 # Prisma schema and migrations
├── public/                 # Static assets
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── api/
│   │   │   └── v1/         # Versioned API routes
│   │   ├── (auth)/         # Authentication routes
│   │   ├── admin/          # Admin portal routes
│   │   ├── recruiter/      # Recruiter portal routes
│   │   └── student/        # Student portal routes
│   ├── components/         # Shared UI components (React) retaining original HTML/CSS structure
│   ├── styles/             # Global CSS variables and stylesheets
│   └── lib/                # Shared utilities, Prisma client, NextAuth config
└── docs/                   # System Design and Documentation
```

## 3. Database Schema Design (PostgreSQL)

### `User` Table
Handles authentication and base profile for all roles.
- `id` (UUID, PK)
- `email` (String, Unique)
- `passwordHash` (String)
- `name` (String)
- `role` (Enum: STUDENT, ADMIN, RECRUITER)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### `StudentProfile` Table
Links to `User`. Stores student-specific data.
- `id` (UUID, PK)
- `userId` (UUID, FK -> User.id, Unique)
- `enrollmentNo` (String, Unique)
- `branch` (String)
- `year` (Int)
- `cgpa` (Float)
- `resumeUrl` (String, optional)
- `skills` (String[])

### `RecruiterProfile` Table
Links to `User`. Stores recruiter-specific data.
- `id` (UUID, PK)
- `userId` (UUID, FK -> User.id, Unique)
- `companyName` (String)

### `Job` Table
Stores job postings.
- `id` (UUID, PK)
- `recruiterId` (UUID, FK -> User.id)
- `title` (String)
- `company` (String)
- `location` (String)
- `type` (String) - e.g., Full Time, Internship
- `package` (String)
- `minCgpa` (Float)
- `eligibleBranches` (String[])
- `deadline` (DateTime)
- `description` (Text)
- `status` (Enum: OPEN, CLOSED)
- `color` (String) - For UI styling
- `logo` (String) - Initials or URL
- `createdAt` (DateTime)

### `Application` Table
Maps Students to Jobs with a status.
- `id` (UUID, PK)
- `studentId` (UUID, FK -> User.id)
- `jobId` (UUID, FK -> Job.id)
- `status` (Enum: APPLIED, SHORTLISTED, SELECTED, REJECTED)
- `appliedAt` (DateTime)

## 4. Frontend Design & UI
The UI will be a direct port of the provided HTML boilerplate.
- **Styling**: Vanilla CSS with predefined CSS variables (`--bg`, `--accent`, `--card`, etc.) to retain the "dark mode", glassmorphism, and gradient aesthetics.
- **Components**: The monolithic HTML file will be broken down into reusable React components:
  - `AuthScreen`, `AppShell`, `NavBar`, `StatCard`, `JobCard`, `ProfileCard`, `Modal`, `Toast`.
- **State Management**: React Context or Zustand for client-side state (current user, active tab, toast notifications).
- **Routing**: Next.js App Router will handle the navigation between `/dashboard`, `/jobs`, `/applications`, `/profile` based on the user's role.

## 5. Backend Design & API Versioning
- **Authentication**: JWT-based session management using NextAuth.js. Role-based middleware will protect routes.
- **API Versioning**: All endpoints will be located under `/api/v1/`. Examples:
  - `GET /api/v1/jobs`
  - `POST /api/v1/applications`
  - `PUT /api/v1/applications/[id]/status`
- **Data Fetching**: Server Components will fetch initial data directly from the PostgreSQL database using Prisma where appropriate, otherwise the client will interact with the versioned API routes.

## 6. Implementation Phases
1. **Setup**: Initialize standard Next.js structure and PostgreSQL database.
2. **Database & Auth**: Define Prisma schema, run migrations, and implement NextAuth for the three roles.
3. **UI Component Migration**: Port HTML/CSS into React components within the Next.js app.
4. **API Development**: Develop the `/api/v1/` routes for Jobs, Applications, and Users.
5. **Student Portal**: Implement job browsing, application submission, and profile viewing.
6. **Recruiter Portal**: Implement job posting and application management (shortlisting/selecting).
7. **Admin Portal**: Implement reporting dashboards and systemic oversight features.
