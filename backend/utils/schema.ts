import { z } from 'zod'

export const promptSchema = z.object({
  message: z.string(),
}).strict()

export const chatSchema = 
  z.object({
    messages: z.array(
      z.object({
        role: z.string(),
        content: z.string(),
      })
    )
  })