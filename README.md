# School Management System

A full-stack School Management System built with **Nuxt 3**, **Tailwind CSS**, **Pinia**, **Drizzle ORM**, **PostgreSQL**, and **Better Auth**.

## Roles & Features
- **Admin**: Manage Instructors, Students, and Subjects.
- **Instructor**: Manage Sections, Enroll Students, View Uploads.
- **Student**: View Enrolled Classes, Upload Documents.

## Prerequisites
- Node.js (v18+)
- PostgreSQL Database

## Setup Service

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   Ensure your `.env` file contains the correct database connection string:
   ```env
   DATABASE_URL=postgresql://postgres:password@localhost:5432/school_management_system
   BETTER_AUTH_SECRET=your_secret_key
   BETTER_AUTH_URL=http://localhost:3000
   ```
   *Note: Update `password` and `school_management_system` (db name) as per your local Postgres setup.*

3. **Initialize Database**
   Run migrations to create the database tables:
   ```bash
   npx drizzle-kit migrate
   ```

## Running the Application

Start the development server:
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

## Testing

Run unit tests:
```bash
npm run test
```
