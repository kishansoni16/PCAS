# Implementation Plan: PCAS Next.js Conversion

This implementation plan is based on the provided HTML boilerplate and user feedback.

## Status
**APPROVED** - Ready for execution.

## Decisions Made
1. **Project Directory**: A standard Next.js project will be initialized in `pcas-nextjs`.
2. **Framework Structure**: Standard Next.js app router structure will be used.
3. **ORM**: Prisma ORM with PostgreSQL.
4. **Backend Architecture**: All backend API endpoints will strictly follow API versioning (e.g., `/api/v1/`).

## Proposed Changes

### Setup & Scaffolding
- Initialize standard Next.js application in `scratch/pcas-nextjs`.
- Setup PostgreSQL Database (locally or via a service) and configure Prisma ORM schema.
- Setup directory structure mapping to the UI layout.

### UI Component Migration (React)
- Break down the monolithic HTML file into modular React components (e.g., `JobCard`, `ProfileCard`, `AppShell`, `NavBar`).
- Extract the Vanilla CSS into a global stylesheet to preserve the exact UI aesthetics, gradients, and dark mode features you built.

### Backend & Database (PostgreSQL & Prisma)
- Define database models for `User`, `StudentProfile`, `Job`, and `Application`.
- Implement `NextAuth.js` for handling multi-role authentication (Student, Recruiter, Admin).
- Create API endpoints strictly adhering to versioning rules (`/api/v1/...`).

### Application Logic (Next.js App Router)
- **Student Flow**: Route `/student/dashboard`, `/student/jobs`, `/student/applications`, and `/student/profile`.
- **Recruiter Flow**: Route `/recruiter/dashboard`, `/recruiter/post-job`, and `/recruiter/applications`.
- **Admin Flow**: Route `/admin/dashboard`, `/admin/students`, `/admin/jobs`, and `/admin/reports`.

## Verification Plan

### Manual Verification
- Start the Next.js development server.
- Log in as a Student, verify eligible jobs are visible based on CGPA and Branch, and test the application process.
- Log in as a Recruiter, post a new job, and verify it appears in the job listings. Shortlist a student application.
- Log in as an Admin, view the placement reports and registry to ensure all data is accurately synced with the PostgreSQL database.
- Visually verify that the React implementation exactly matches the original HTML/CSS design.
