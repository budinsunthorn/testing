import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  errorFormat: 'colorless',
})
export interface Context {
  prisma: PrismaClient
}

export const context: Context = {
  prisma: prisma,
}
