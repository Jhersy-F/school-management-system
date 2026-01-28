import { students } from '../../database/schema'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { studentNumber, firstname, middlename, lastname, email, password } = body

  if (!email || !password || !firstname || !lastname || !studentNumber) {
    throw createError({ statusCode: 400, message: 'Missing fields' })
  }

  const hashedPassword = await hashPassword(password)

  try {
    await db.insert(students).values({
      studentNumber,
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
