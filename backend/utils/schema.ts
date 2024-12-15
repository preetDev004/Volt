import { z } from 'zod'

export const promptSchema = z.object({
  message: z.string(),
}).strict()