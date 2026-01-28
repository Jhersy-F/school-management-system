import { hash, compare } from 'bcryptjs'

export const hashPassword = async (password: string) => {
  return await hash(password, 10)
}

export const verifyPassword = async (hashed: string, plain: string) => {
  return await compare(plain, hashed)
}
