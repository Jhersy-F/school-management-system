import { sections, subjects } from '../../database/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const { user } = await $fetch('/api/auth/session', { headers: event.headers })
  if (!user || user.role !== 'instructor') {
    throw createError({ statusCode: 403, message: 'Unauthorized' })
  }

  // Get distinct subjects for this instructor
  // Drizzle distinct on a joined column might depend on driver capabilities, 
  // but we can select distinct id using JS or specific SQL.
  // Simple approach: Fetch all sections with subject info, then dedup in JS.
  
  const rows = await db.select({
    id: subjects.id,
    code: subjects.code,
    name: subjects.name,
    description: subjects.description,
    createdAt: subjects.createdAt
  })
  .from(sections)
  .innerJoin(subjects, eq(sections.subjectId, subjects.id))
  .where(eq(sections.instructorId, user.id))

  // Deduplicate by ID
  const uniqueSubjects = Array.from(new Map(rows.map(item => [item.id, item])).values())

  return { subjects: uniqueSubjects }
})
