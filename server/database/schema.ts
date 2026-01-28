import { pgTable, serial, text, timestamp, integer, boolean } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

export const admins = pgTable('admins', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

export const instructors = pgTable('instructors', {
  id: serial('id').primaryKey(),
  firstname: text('firstname').notNull(),
  middlename: text('middlename'),
  lastname: text('lastname').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

export const students = pgTable('students', {
  id: serial('id').primaryKey(),
  studentNumber: text('student_number').notNull().unique(),
  firstname: text('firstname').notNull(),
  middlename: text('middlename'),
  lastname: text('lastname').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

export const subjects = pgTable('subjects', {
  id: serial('id').primaryKey(),
  code: text('code').notNull().unique(),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
})

export const sections = pgTable('sections', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  subjectId: integer('subject_id').references(() => subjects.id).notNull(),
  instructorId: integer('instructor_id').references(() => instructors.id).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

export const enrollments = pgTable('enrollments', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').references(() => students.id).notNull(),
  sectionId: integer('section_id').references(() => sections.id).notNull(),
  enrolledAt: timestamp('enrolled_at').defaultNow(),
})

export const documents = pgTable('documents', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').references(() => students.id).notNull(),
  sectionId: integer('section_id').references(() => sections.id).notNull(),
  filePath: text('file_path').notNull(),
  fileType: text('file_type').notNull(),
  uploadedAt: timestamp('uploaded_at').defaultNow(),
})

export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(), // Session ID usually a token/uuid
  userId: text('user_id').notNull(), // "role:id"
  expiresAt: timestamp('expires_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow(),
})


// Relations
export const subjectsRelations = relations(subjects, ({ many }) => ({
  sections: many(sections),
}))

export const sectionsRelations = relations(sections, ({ one, many }) => ({
  subject: one(subjects, {
    fields: [sections.subjectId],
    references: [subjects.id],
  }),
  instructor: one(instructors, {
    fields: [sections.instructorId],
    references: [instructors.id],
  }),
  enrollments: many(enrollments),
  documents: many(documents),
}))

export const instructorsRelations = relations(instructors, ({ many }) => ({
  sections: many(sections),
}))

export const studentsRelations = relations(students, ({ many }) => ({
  enrollments: many(enrollments),
  documents: many(documents),
}))

export const enrollmentsRelations = relations(enrollments, ({ one }) => ({
  student: one(students, {
    fields: [enrollments.studentId],
    references: [students.id],
  }),
  section: one(sections, {
    fields: [enrollments.sectionId],
    references: [sections.id],
  }),
}))

export const documentsRelations = relations(documents, ({ one }) => ({
  student: one(students, {
    fields: [documents.studentId],
    references: [students.id],
  }),
  section: one(sections, {
    fields: [documents.sectionId],
    references: [sections.id],
  }),
}))
