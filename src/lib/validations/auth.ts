import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),

  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export type LoginFormValues = z.infer<
  typeof loginSchema
>;


export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name cannot exceed 50 characters"),

    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),

    phone: z
      .string()
      .trim()
      .min(11, "Phone number must be at least 11 characters")
      .max(15, "Phone number cannot exceed 15 characters"),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(100, "Password cannot exceed 100 characters"),

    confirmPassword: z
      .string()
      .min(1, "Please confirm your password"),

    role: z.enum(["CUSTOMER", "TECHNICIAN"], {
      message: "Please select an account type",
    }),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    },
  );

export type RegisterFormValues = z.infer<
  typeof registerSchema
>;