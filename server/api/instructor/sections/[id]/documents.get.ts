import { documents, students, sections } from '../../../../database/schema'
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
    id: documents.id,
    filePath: documents.filePath,
    fileType: documents.fileType,
    uploadedAt: documents.uploadedAt,
    studentName: students.firstname, // Simplified, maybe concat
    studentLastname: students.lastname,
    studentNumber: students.studentNumber
  })
  .from(documents)
  .innerJoin(students, eq(documents.studentId, students.id))
  .where(eq(documents.sectionId, sectionId))

  return { documents: list }
})
