import { eq } from 'drizzle-orm'
import { sessions } from '../../database/schema'

export default defineEventHandler(async (event) => {
  const sessionId = getCookie(event, 'auth_session')
  if (!sessionId) {
    return { success: true }
  }

  await db.delete(sessions).where(eq(sessions.id, sessionId))
  deleteCookie(event, 'auth_session')

  return { success: true }
})
