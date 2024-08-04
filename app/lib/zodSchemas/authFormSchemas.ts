import { z } from "zod";

const emailSchema = z
  .string()
  .trim()
  .email({
    message: "Must be a valid email format. Example: user@service.com",
  })
  .min(5, { message: "Email must be at least 5 characters long" })
  .max(320, { message: "Email must be at most 320 characters long" });

export const loginFormSchema = z.object({
  email: emailSchema,
  password: z.string().trim().min(1, { message: "Password required" }),
});

export const signupFormSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(100, { message: "Password must be at most 100 characters long" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/^\S*$/, { message: "Password must not contain spaces" }),
});

export type LoginFormSchema = z.infer<typeof loginFormSchema>;
export type FlattenedLoginFormSchemaErrors =
  z.typeToFlattenedError<LoginFormSchema>;
