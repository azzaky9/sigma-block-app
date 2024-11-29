import * as z from "zod";

export const authSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email wajib di isi" })
    .email({ message: "Format email tidak sesuai @" }),
  password: z.string().min(3, { message: "Minimal 6 karakter" })
});
