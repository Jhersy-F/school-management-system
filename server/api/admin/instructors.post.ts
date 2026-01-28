import { instructors } from '../../database/schema'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { firstname, middlename, lastname, email, password } = body

  if (!email || !password || !firstname || !lastname) {
    throw createError({ statusCode: 400, message: 'Missing fields' })
  }

  const hashedPassword = await hashPassword(password)

  try {
    await db.insert(instructors).values({
      firstname,
      middlename,
      lastname,
      email,
      password: hashedPassword
    })
    return { success: true }
  } catch (e: any) {
    throw createError({ statusCode: 500, message: e.message })
  }
})
