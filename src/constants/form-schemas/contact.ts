import * as z from "zod";

export const contactFormSchema = z.object({
  name: z.string().trim().min(2).max(64),
  email: z.string().trim().email().max(64),
  message: z.string().trim().min(10).max(512),
});
