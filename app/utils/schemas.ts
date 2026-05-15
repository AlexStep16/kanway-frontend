import z from "zod"

export const boardSchema = z.object({
  name: z.string()
    .min(1, 'Введите название доски')
    .max(50, 'Название слишком длинное')
    .trim()
})

export type BoardFormValues = z.infer<typeof boardSchema>