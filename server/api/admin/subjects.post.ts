import { subjects } from '../../database/schema'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { code, name, description } = body

  if (!code || !name) {
    throw createError({ statusCode: 400, message: 'Missing fields' })
  }

  try {
    await db.insert(subjects).values({
      code,
      name,
      description
    })
    return { success: true }
  } catch (e: any) {
    throw createError({ statusCode: 500, message: e.message })
  }
})
