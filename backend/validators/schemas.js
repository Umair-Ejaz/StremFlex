import { z } from 'zod';

// User Registration Validation Schema
export const registerSchema = z.object({
  username: z
    .string({ required_error: 'Username is required' })
    .min(3, 'Username must be at least 3 characters long')
    .max(20, 'Username cannot exceed 20 characters')
    .trim(),
  email: z
    .string({ required_error: 'Email is required' })
    .email('Invalid email address format')
    .toLowerCase()
    .trim(),
  password: z
    .string({ required_error: 'Password is required' })
    .min(6, 'Password must be at least 6 characters long'),
  isAdmin: z.boolean().optional(),
});

// User Login Validation Schema
export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Invalid email address format')
    .toLowerCase()
    .trim(),
  password: z
    .string({ required_error: 'Password is required' })
    .min(1, 'Password field cannot be empty'),
});

// Video Creation Validation Schema
export const createVideoSchema = z.object({
  title: z
    .string({ required_error: 'Video title is required' })
    .min(3, 'Title must be at least 3 characters')
    .trim(),
  description: z.string().optional(),
  sourceType: z.enum(['youtube', 'twitch', 'local'], {
    errorMap: () => ({ message: 'Source type must be youtube, twitch, or local' }),
  }),
  videoUrl: z.string().optional(),
  thumbnailUrl: z.string().optional(),
});

// Comment Creation Validation Schema
export const commentSchema = z.object({
  text: z
    .string({ required_error: 'Comment text is required' })
    .min(1, 'Comment cannot be empty')
    .trim(),
});