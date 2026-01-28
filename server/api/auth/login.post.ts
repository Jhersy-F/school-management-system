import { eq, or } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'
import { admins, instructors, students, sessions } from '../../database/schema'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { identifier, password, role } = body

  if (!identifier || !password || !role) {
    throw createError({ statusCode: 400, message: 'Missing credentials' })
  }

  let user = null
  let userIdPrefix = ''

  if (role === 'admin') {
    const [found] = await db.select().from(admins).where(eq(admins.username, identifier))
    user = found
    userIdPrefix = 'admin'
  } else if (role === 'instructor') {
    const [found] = await db.select().from(instructors).where(eq(instructors.email, identifier))
    user = found
    userIdPrefix = 'instructor'
  } else if (role === 'student') {
    // Check email OR student number
    const [found] = await db.select().from(students).where(
        or(eq(students.email, identifier), eq(students.studentNumber, identifier))
    )
    user = found
    userIdPrefix = 'student'
  } else {
    throw createError({ statusCode: 400, message: 'Invalid role' })
  }

  if (!user) {
    throw createError({ statusCode: 401, message: 'Invalid credentials' })
  }

  const isValid = await verifyPassword(user.password, password)
  if (!isValid) {
    throw createError({ statusCode: 401, message: 'Invalid credentials' })
  }

  // Create Session
  const sessionId = uuidv4()
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) // 7 days

  await db.insert(sessions).values({
    id: sessionId,
    userId: `${userIdPrefix}:${user.id}`,
    expiresAt,
    userAgent: getRequestHeader(event, 'user-agent'),
    ipAddress: getRequestIP(event)
  })

  setCookie(event, 'auth_session', sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt
  })

  return { success: true, user: { id: user.id, role } }
})
