import { z } from "zod";
import {
  MAX_NAME_LENGTH,
  MAX_MESSAGE_LENGTH,
  MIN_GUEST_COUNT,
  MAX_GUEST_COUNT,
} from "@/lib/constants";

export const rsvpSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters long.")
    .max(MAX_NAME_LENGTH, `Name must be at most ${MAX_NAME_LENGTH} characters long.`)
    .regex(/^[a-zA-Z\s\u00C0-\u024F\u1E00-\u1EFF'-]+$/, "Invalid name format."),
  attendance: z.enum(["attending", "not_attending", "maybe"], {
    errorMap: () => ({ message: "Please select an attendance status." }),
  }),
  guestCount: z
    .number()
    .int()
    .min(MIN_GUEST_COUNT, `Minimal ${MIN_GUEST_COUNT} guests`)
    .max(MAX_GUEST_COUNT, `Maximal ${MAX_GUEST_COUNT} guests`),
  message: z
    .string()
    .max(MAX_MESSAGE_LENGTH, `Message must be at most ${MAX_MESSAGE_LENGTH} characters long.`)
    .optional()
    .default(""),
});

export const guestbookSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters long.")
    .max(MAX_NAME_LENGTH, `Name must be at most ${MAX_NAME_LENGTH} characters long.`)
    .regex(/^[a-zA-Z\s\u00C0-\u024F\u1E00-\u1EFF'-]+$/, "Invalid name format."),
  message: z
    .string()
    .min(5, "Message must be at least 5 characters long.")
    .max(MAX_MESSAGE_LENGTH, `Message must be at most ${MAX_MESSAGE_LENGTH} characters long.`),
});

export type RsvpFormValues = z.infer<typeof rsvpSchema>;
export type GuestbookFormValues = z.infer<typeof guestbookSchema>;
