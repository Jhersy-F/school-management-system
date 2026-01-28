import { subjects } from '../../database/schema'

export default defineEventHandler(async (event) => {
  const list = await db.select().from(subjects)
  return { subjects: list }
})
