import { z } from 'zod';

export const firebaseSessionSchema = z.object({
  body: z.object({
    idToken: z.string().min(20)
  })
});

export const updateAccountSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(120).optional(),
    profileImage: z.string().url().optional()
  })
});
