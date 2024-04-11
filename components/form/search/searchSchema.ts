import { z } from 'zod';

export const searchFormSchema = z.object({
  search_term: z.string(),
  histamine_severity_order_by: z.string().default('asc'),
  category_filter: z.string().optional().array().max(3),
});

export type SearchFormValues = z.infer<typeof searchFormSchema>;
