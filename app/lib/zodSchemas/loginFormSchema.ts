import { z } from "zod";

export const loginFormSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().trim(),
});
