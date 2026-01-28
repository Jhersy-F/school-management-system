import { students } from '../../database/schema'

export default defineEventHandler(async (event) => {
  // TODO: Verify Admin Role?
  const list = await db.select({
    id: students.id,
    studentNumber: students.studentNumber,
    firstname: students.firstname,
    lastname: students.lastname,
    email: students.email,
    createdAt: students.createdAt
  }).from(students)
  
  return { students: list }
})
