import { z } from 'zod';

export const upsertFormSchema = z.object({
  name: z.string(),
  histamine: z.string().optional(),
  histamine_severity_num: z.string().default('3'),
  categoryId: z.string(),
  note: z.string().optional(),
});

export type UpsertFormValues = z.infer<typeof upsertFormSchema>;
