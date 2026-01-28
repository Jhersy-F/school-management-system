import { eq } from 'drizzle-orm'
import { admins, instructors, students, sessions } from '../../database/schema'

export default defineEventHandler(async (event) => {
  const sessionId = getCookie(event, 'auth_session')
  if (!sessionId) {
    return { user: null }
  }

  const [session] = await db.select().from(sessions).where(eq(sessions.id, sessionId))
  
  if (!session || new Date(session.expiresAt) < new Date()) {
    deleteCookie(event, 'auth_session')
    return { user: null }
  }

  // Parse userId "role:id"
  const [role, idStr] = session.userId.split(':')
  const id = parseInt(idStr)

  let user = null
  if (role === 'admin') {
    const [found] = await db.select({ id: admins.id, username: admins.username }).from(admins).where(eq(admins.id, id))
    user = found
  } else if (role === 'instructor') {
    const [found] = await db.select({ id: instructors.id, firstname: instructors.firstname, lastname: instructors.lastname, email: instructors.email }).from(instructors).where(eq(instructors.id, id))
    user = found
  } else if (role === 'student') {
    const [found] = await db.select({ id: students.id, firstname: students.firstname, lastname: students.lastname, email: students.email, studentNumber: students.studentNumber }).from(students).where(eq(students.id, id))
    user = found
  }

  if (!user) {
    return { user: null }
  }

  return { user: { ...user, role } }
})
