import { z } from "zod";

const nameRule = z
  .string()
  .trim()
  .min(2, "Name must be at least 2 characters")
  .max(50, "Name must not exceed 50 characters")
  .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces");

const emailRule = z
  .string()
  .trim()
  .min(1, "Email is required")
  .email("Please enter a valid email address")
  .max(100, "Email must not exceed 100 characters");

const passwordRule = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(64, "Password must not exceed 64 characters")
  .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter")
  .regex(/[a-z]/, "Password must contain at least 1 lowercase letter")
  .regex(/[0-9]/, "Password must contain at least 1 number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least 1 special character")
  .regex(/^\S*$/, "Password must not contain spaces");

export const signupSchema = z
  .object({
    name: nameRule,
    email: emailRule,
    password: passwordRule,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      const emailUser = data.email.split("@")[0].toLowerCase();
      return emailUser === "" || !data.password.toLowerCase().includes(emailUser);
    },
    { message: "Password must not contain your email", path: ["password"] }
  )
  .refine(
    (data) => {
      const lowerName = data.name.trim().toLowerCase();
      return lowerName === "" || !data.password.toLowerCase().includes(lowerName);
    },
    { message: "Password must not contain your name", path: ["password"] }
  );

export const loginSchema = z.object({
  email: emailRule,
  password: z.string().min(1, "Password is required"),
});

export const updateProfileSchema = z.object({
  name: nameRule,
  email: emailRule,
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: passwordRule,
});

export const deleteAccountSchema = z.object({
  password: z.string().min(1, "Password is required to delete your account"),
});