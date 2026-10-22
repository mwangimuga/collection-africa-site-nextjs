import { z } from "zod";

const name = z.string().trim().min(2, "Enter your full name").max(120);
const email = z.string().trim().email("Enter a valid email address").max(200);
/** Kenyan and international formats, permissive on spacing. */
const phone = z
  .string()
  .trim()
  .regex(/^[+0-9()\s-]{7,20}$/, "Enter a valid phone number")
  .optional()
  .or(z.literal(""));

export const enquirySchema = z.object({
  name,
  email,
  phone,
  organisation: z.string().trim().max(160).optional().or(z.literal("")),
  service: z.string().trim().max(80).optional().or(z.literal("")),
  message: z.string().trim().min(20, "Tell us a little more — 20 characters minimum").max(4000),
  consent: z.literal(true, { message: "Please confirm you agree to be contacted" }),
  // Honeypot: real users never fill this. Bots usually do.
  company_website: z.string().max(0).optional().or(z.literal("")),
  // Time-on-page in ms. Sub-3-second submissions are almost always bots.
  elapsed: z.coerce.number().optional(),
});

export const applicationSchema = z.object({
  name,
  email,
  phone: z.string().trim().regex(/^[+0-9()\s-]{7,20}$/, "Enter a valid phone number"),
  role: z.string().trim().min(2).max(160),
  location: z.string().trim().max(120).optional().or(z.literal("")),
  message: z.string().trim().max(4000).optional().or(z.literal("")),
  consent: z.literal(true, { message: "Please confirm you agree to be contacted" }),
  company_website: z.string().max(0).optional().or(z.literal("")),
});

export type Enquiry = z.infer<typeof enquirySchema>;
export type Application = z.infer<typeof applicationSchema>;

export const MAX_CV_BYTES = 5 * 1024 * 1024; // 5 MB
export const ALLOWED_CV_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
