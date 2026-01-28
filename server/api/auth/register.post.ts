import { instructors, students } from '../../database/schema'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { role, firstname, middlename, lastname, email, password, studentNumber } = body

  if (!email || !password || !firstname || !lastname || !role) {
    throw createError({ statusCode: 400, message: 'Missing fields' })
  }

  const hashedPassword = await hashPassword(password)

  try {
    if (role === 'instructor') {
       await db.insert(instructors).values({
        firstname,
        middlename,
        lastname,
        email,
        password: hashedPassword
      })
    } else if (role === 'student') {
      if (!studentNumber) {
        throw createError({ statusCode: 400, message: 'Student Number required' })
      }
      await db.insert(students).values({
        studentNumber,
        firstname,
        middlename,
        lastname,
        email,
        password: hashedPassword
      })
    } else {
      throw createError({ statusCode: 400, message: 'Invalid role' })
    }
    return { success: true }
  } catch (e: any) {
    // Check for unique constraint violation (duplicate email/student number)
    if (e.code === '23505') { // Postgres unique violation
        throw createError({ statusCode: 400, message: 'Email or Student Number already exists' })
    }
    throw createError({ statusCode: 500, message: e.message })
  }
})
