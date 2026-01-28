import { sections } from '../../database/schema'

export default defineEventHandler(async (event) => {
  const { user } = await $fetch('/api/auth/session', { headers: event.headers })
  if (!user || user.role !== 'instructor') {
    throw createError({ statusCode: 403, message: 'Unauthorized' })
  }

  const body = await readBody(event)
  const { name, subjectId } = body

  if (!name || !subjectId) {
    throw createError({ statusCode: 400, message: 'Missing fields' })
  }

  try {
    await db.insert(sections).values({
      name,
      subjectId,
      instructorId: user.id
    })
    return { success: true }
  } catch (e: any) {
    throw createError({ statusCode: 500, message: e.message })
  }
})
