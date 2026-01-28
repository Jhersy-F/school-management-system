import { sections, subjects, instructors } from '../../database/schema'
import { eq, and } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { user } = await $fetch('/api/auth/session', { headers: event.headers })
  if (!user || user.role !== 'instructor') {
    throw createError({ statusCode: 403, message: 'Unauthorized' })
  }

  const list = await db.select({
    id: sections.id,
    name: sections.name,
    subjectCode: subjects.code,
    subjectName: subjects.name,
    createdAt: sections.createdAt
  })
  .from(sections)
  .leftJoin(subjects, eq(sections.subjectId, subjects.id))
  .where(
    and(
      eq(sections.instructorId, user.id),
      query.subjectId ? eq(sections.subjectId, parseInt(query.subjectId as string)) : undefined
    )
  )
  
  return { sections: list }
})
