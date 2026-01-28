import { describe, it, expect } from 'vitest'
import { hashPassword, verifyPassword } from '../server/utils/password'

describe('Password Utilities', () => {
  it('should hash a password correctly', async () => {
    const password = 'mySecretPassword'
    const hash = await hashPassword(password)
    expect(hash).not.toBe(password)
    expect(hash).toContain('$') // bcrypt hash usually starts with $
  })

  it('should verify a correct password', async () => {
    const password = 'password123'
    const hash = await hashPassword(password)
    const isValid = await verifyPassword(hash, password)
    expect(isValid).toBe(true)
  })

  it('should reject an incorrect password', async () => {
    const password = 'password123'
    const hash = await hashPassword(password)
    const isValid = await verifyPassword(hash, 'wrongPassword')
    expect(isValid).toBe(false)
  })
})
