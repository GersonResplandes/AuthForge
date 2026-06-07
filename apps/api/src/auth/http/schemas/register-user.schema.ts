import { z } from 'zod';

export const registerUserSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z
    .string()
    .trim()
    .email()
    .max(254)
    .transform((email) => email.toLowerCase()),
  password: z.string().min(1),
});

export type RegisterUserBody = z.infer<typeof registerUserSchema>;
