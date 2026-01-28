import { enrollments, students, sections } from '../../../../database/schema'
import { eq, and } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const { user } = await $fetch('/api/auth/session', { headers: event.headers })
  if (!user || user.role !== 'instructor') {
    throw createError({ statusCode: 403, message: 'Unauthorized' })
  }
  const sectionId = parseInt(event.context.params?.id as string)
  
  // Verify ownership
  const [section] = await db.select().from(sections).where(
    and(eq(sections.id, sectionId), eq(sections.instructorId, user.id))
  )
  if (!section) {
    throw createError({ statusCode: 403, message: 'Unauthorized' })
  }

  const list = await db.select({
    id: students.id,
    studentNumber: students.studentNumber,
    firstname: students.firstname,
    lastname: students.lastname,
    email: students.email,
    enrolledAt: enrollments.enrolledAt
  })
  .from(enrollments)
  .innerJoin(students, eq(enrollments.studentId, students.id))
  .where(eq(enrollments.sectionId, sectionId))

  return { students: list }
})
