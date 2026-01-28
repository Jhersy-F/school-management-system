import { enrollments, students, sections } from '../../../../database/schema'
import { eq, or, and } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const { user } = await $fetch('/api/auth/session', { headers: event.headers })
  if (!user || user.role !== 'instructor') {
    throw createError({ statusCode: 403, message: 'Unauthorized' })
  }

  const sectionId = parseInt(event.context.params?.id as string)
  const body = await readBody(event)
  const { identifier } = body

  if (!identifier) {
    throw createError({ statusCode: 400, message: 'Missing identifier' })
  }

  // Find Student
  const [student] = await db.select().from(students).where(
    or(eq(students.email, identifier), eq(students.studentNumber, identifier))
  )

  if (!student) {
    throw createError({ statusCode: 404, message: 'Student not found' })
  }

  // Check generic ownership? (Assuming middleware/logic ensures instructor owns section or trusting ID for now, improved check below)
  const [section] = await db.select().from(sections).where(
    and(eq(sections.id, sectionId), eq(sections.instructorId, user.id))
  )
  if (!section) {
    throw createError({ statusCode: 403, message: 'Section not found or unauthorized' })
  }

  // Check existing enrollment
  const [existing] = await db.select().from(enrollments).where(
    and(eq(enrollments.studentId, student.id), eq(enrollments.sectionId, sectionId))
  )
  
  if (existing) {
    return { success: true, message: 'Already enrolled' }
  }

  await db.insert(enrollments).values({
    studentId: student.id,
    sectionId
  })

  return { success: true }
})
