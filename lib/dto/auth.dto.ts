import z from "zod";

export const loginSchema = z.object({
  //   email: z.string().email().optional(),
  email: z.string(),
  password: z.string().min(6).optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
