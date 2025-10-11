import { z } from "zod";

// Option schema validation
export const optionSchema = z.object({
  label: z.string().nonempty({ message: "Option label is required" }),
  value: z.number({ message: "Option value must be a number" }), // শুধু message ব্যবহার
});

// Question schema validation
export const questionsPostValidation = z.object({
  // questionNumber: z
  //   .number({ message: "Question number must be a number" }),
  text: z.string().nonempty({ message: "Question text is required" }),
  options: z
    .array(optionSchema)
    .min(1, { message: "At least one option is required" }),
  domain: z.string().nonempty({ message: "Domain is required" }),
  weight: z
    .number({ message: "Weight must be a number" })
    .nonnegative({ message: "Weight cannot be negative" }),
  inverted: z.boolean().optional(),
  part: z
    .number({ message: "Part must be a number" })
    .refine((val) => val === 1 || val === 2, {
      message: "Part must be 1 (Main) or 2 (Follow-up)",
    })
    .optional(),

  followUpTrigger: z.string().nullable().optional(),
});

export const questionsUpdateValidation = questionsPostValidation.partial();
