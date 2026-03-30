import { z } from 'zod';

export const PostCreateSchema = z.object ({
    title: z.string().min(1).max(200), // must be a string, not empty, max 200 chars
    content: z.string().min(1),
});

export const PostUpdateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.string().min(1).optional(),
}) .refine(data => data.title || data.content, {
  message: 'At least one field required to update',
}); 

export type PostCreateInput = z.infer<typeof PostCreateSchema>;
export type PostUpdateInput = z.infer<typeof PostUpdateSchema>;