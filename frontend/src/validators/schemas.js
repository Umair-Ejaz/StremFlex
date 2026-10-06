import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Invalid email address format'),
  password: z
    .string()
    .min(1, 'Password is required'),
});

export const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username cannot exceed 20 characters'),
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Invalid email address format'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters'),
});

export const uploadVideoSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, 'Title must be at least 3 characters long'),
    description: z.string().optional(),
    sourceType: z.enum(['youtube', 'twitch', 'local'], {
      errorMap: () => ({ message: 'Source type must be youtube, twitch, or local' }),
    }),
    videoUrl: z.string().optional(),
  })
  .refine(
    (data) => {
      // YouTube ya Twitch ke liye videoUrl lazmi hai
      if (['youtube', 'twitch'].includes(data.sourceType)) {
        return !!data.videoUrl && data.videoUrl.trim().length > 0;
      }
      return true;
    },
    {
      message: 'Video URL is required for YouTube or Twitch uploads',
      path: ['videoUrl'],
    }
  );


 

export const uploadThumbnailSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, 'Title must be at least 3 characters long'),
    description: z.string().optional(),
    sourceType: z.enum(['youtube', 'twitch', 'local'], {
      errorMap: () => ({ message: 'Source type must be youtube, twitch, or local' }),
    }),
    videoUrl: z.string().optional(),
    thumbnailUrl: z.string().optional(),
  })
  .refine(
    (data) => {
      if (['youtube', 'twitch'].includes(data.sourceType)) {
        return !!data.videoUrl && data.videoUrl.trim().length > 0;
      }
      return true;
    },
    {
      message: 'Video URL is required for YouTube or Twitch uploads',
      path: ['videoUrl'],
    }
  );