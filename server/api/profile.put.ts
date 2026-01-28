import { admins, instructors, students } from '../database/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const { user } = await $fetch('/api/auth/session', { headers: event.headers })
  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const body = await readBody(event)
  const { firstname, middlename, lastname, password } = body

  // Prepare updates
  const updates: any = {}
  if (firstname) updates.firstname = firstname
  if (middlename !== undefined) updates.middlename = middlename
  if (lastname) updates.lastname = lastname
  if (password) {
    updates.password = await hashPassword(password)
  }

  if (Object.keys(updates).length === 0) {
    return { success: true }
  }

  // Update based on role
  if (user.role === 'admin') {
     // Admin might not have firstname/lastname in schema? Schema: id, username, password.
     // Skip for admin or update password only
     if (password) {
        await db.update(admins).set({ password: updates.password }).where(eq(admins.id, user.id))
     }
  } else if (user.role === 'instructor') {
    await db.update(instructors).set(updates).where(eq(instructors.id, user.id))
  } else if (user.role === 'student') {
    await db.update(students).set(updates).where(eq(students.id, user.id))
  }

  return { success: true }
})
