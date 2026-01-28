import { enrollments, sections, subjects, instructors } from '../../database/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const { user } = await $fetch('/api/auth/session', { headers: event.headers })
  if (!user || user.role !== 'student') {
    throw createError({ statusCode: 403, message: 'Unauthorized' })
  }

  const list = await db.select({
    id: sections.id,
    name: sections.name,
    subjectCode: subjects.code,
    subjectName: subjects.name,
    instructorName: instructors.lastname
  })
  .from(enrollments)
  .innerJoin(sections, eq(enrollments.sectionId, sections.id))
  .innerJoin(subjects, eq(sections.subjectId, subjects.id))
  .innerJoin(instructors, eq(sections.instructorId, instructors.id))
  .where(eq(enrollments.studentId, user.id))

  return { sections: list }
})
