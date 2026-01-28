import { instructors } from '../../database/schema'

export default defineEventHandler(async (event) => {
  // TODO: Verify Admin Role?
  const list = await db.select({
    id: instructors.id,
    firstname: instructors.firstname,
    lastname: instructors.lastname,
    email: instructors.email,
    createdAt: instructors.createdAt
  }).from(instructors)
  
  return { instructors: list }
})
