import { z } from "zod";

export const schemaValidator = z.object({
  email: z.string().email(),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long",
  }),
});

export type TschemaValidator = z.infer<typeof schemaValidator>;
