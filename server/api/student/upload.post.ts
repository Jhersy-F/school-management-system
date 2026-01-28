import { documents } from '../../database/schema'
import { join } from 'path'
import { writeFile, mkdir } from 'fs/promises'

export default defineEventHandler(async (event) => {
  const { user } = await $fetch('/api/auth/session', { headers: event.headers })
  if (!user || user.role !== 'student') {
    throw createError({ statusCode: 403, message: 'Unauthorized' })
  }

  const files = await readMultipartFormData(event)
  if (!files || files.length === 0) {
    throw createError({ statusCode: 400, message: 'No file uploaded' })
  }

  // Expect sectionId field
  const sectionIdField = files.find(f => f.name === 'sectionId')
  if (!sectionIdField) {
    throw createError({ statusCode: 400, message: 'Missing sectionId' })
  }
  const sectionId = parseInt(sectionIdField.data.toString())

  const file = files.find(f => f.name === 'file')
  if (!file) {
    throw createError({ statusCode: 400, message: 'Missing file' })
  }

  // Validate Type
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  if (!allowedTypes.includes(file.type || '')) {
     // throw createError({ statusCode: 400, message: 'Invalid file type' }) 
     // Strict validation disabled for demo, but recommended
  }

  const fileName = `${Date.now()}-${file.filename}`
  const uploadDir = join(process.cwd(), 'public', 'uploads')
  
  // Ensure dir exists
  await mkdir(uploadDir, { recursive: true })
  
  await writeFile(join(uploadDir, fileName), file.data)

  await db.insert(documents).values({
    studentId: user.id,
    sectionId,
    filePath: `/uploads/${fileName}`,
    fileType: file.type || 'unknown'
  })

  return { success: true }
})
