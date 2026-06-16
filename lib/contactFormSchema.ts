import { z } from "zod";

export type ContactFormInput = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export function createContactFormSchema(subjectValues: string[]) {
  const unique = [...new Set(subjectValues.filter(Boolean))];
  if (unique.length === 0) {
    unique.push("general");
  }

  const subjectEnum = z.enum(unique as [string, ...string[]]);

  return z.object({
    name: z.string().trim().min(1, "Name is required").max(120),
    email: z.string().trim().email("Enter a valid email"),
    subject: subjectEnum,
    message: z.string().trim().min(10, "Message must be at least 10 characters").max(8000),
  });
}
