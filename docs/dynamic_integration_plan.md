# Make PCAS Frontend Dynamic

Currently, the Next.js frontend uses static mock arrays to render the UI components. This plan outlines the steps to connect the frontend to the real database using NextAuth and the API endpoints we created.

## User Review Required

> [!IMPORTANT]
> Since we are using Next.js App Router, we can fetch data directly on the Server (Server Components) or on the Client (using `useEffect` and `/api/v1` routes). 
> For this migration, I plan to use **Client-side data fetching (`useEffect`)** for most pages since your components already use `useState` and `'use client'`. If you strongly prefer Server Components for SEO/performance, let me know!

## Proposed Changes

### 1. Database Seeding & Mock Data
Since your database is fresh, we need initial users to log in and test the system.
#### [NEW] `prisma/seed.ts`
- Create a script that populates the database with:
  - 1 Admin user (`admin@jiit.ac.in`)
  - 1 Student user (`student@jiit.ac.in`) with a complete StudentProfile.
  - 1 Recruiter user (`recruiter@jiit.ac.in`) with a complete RecruiterProfile.
  - A few mock jobs and applications.
#### [MODIFY] `package.json`
- Add Prisma seeding configuration so you can run `npx prisma db seed`.

---

### 2. NextAuth Integration (Authentication)
We need to manage user sessions across the entire app.
#### [NEW] `src/components/Providers.tsx`
- Create a wrapper component for `SessionProvider`.
#### [MODIFY] `src/app/layout.tsx`
- Wrap the children in the new `<Providers>` component so every page can access `useSession()`.
#### [MODIFY] `src/components/AuthBox.tsx`
- Replace the mock redirect logic with `await signIn('credentials', { email, password, role })`.
#### [MODIFY] `src/components/NavBar.tsx`
- Use `useSession()` to display the real user's name, role, and handle the `signOut()` flow.
#### [MODIFY] Layouts (`src/app/student/layout.tsx`, etc.)
- Protect the routes. If a user is not logged in or has the wrong role, redirect them to the login page.

---

### 3. Student Portal Integration
#### [MODIFY] `src/app/student/jobs/page.tsx`
- Fetch open jobs from `GET /api/v1/jobs`.
- Allow applying using `POST /api/v1/applications`.
- Show success/error messages upon applying.
#### [MODIFY] `src/app/student/applications/page.tsx`
- Fetch the student's applications from `GET /api/v1/applications`.
#### [MODIFY] `src/app/student/dashboard/page.tsx`
- Calculate real stats based on the fetched data.

---

### 4. Recruiter Portal Integration
#### [MODIFY] `src/app/recruiter/dashboard/page.tsx` & `src/app/recruiter/applications/page.tsx`
- Fetch jobs created by the recruiter.
- Fetch applications for those jobs.
- Implement the 'Shortlist', 'Select', and 'Reject' buttons using `PUT /api/v1/applications/[id]/status`.
#### [MODIFY] `src/app/recruiter/post-job/page.tsx`
- Hook up the form submission to `POST /api/v1/jobs`.

---

### 5. Admin Portal Integration
#### [MODIFY] `src/app/admin/students/page.tsx`
- Fetch all registered students from `GET /api/v1/students`.
#### [MODIFY] `src/app/admin/jobs/page.tsx`
- Fetch all jobs across the platform.
#### [NEW] `src/app/api/v1/stats/route.ts`
- Create a new API route specifically for the Admin Dashboard to aggregate placement rates, open drives, and total applications.

## Verification Plan
### Automated Tests
- I will run `npm run dev` and ensure the Next.js compilation succeeds without errors.
- Run `npx prisma db seed` to populate the Supabase database.
### Manual Verification
- You will be able to log in using the credentials populated by the seed script.
- You can verify that posting a job as a Recruiter instantly updates the Job Board for the Student.
