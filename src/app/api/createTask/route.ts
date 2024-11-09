import prisma from "@/lib/prisma";
import { z } from "zod";

const ZTaskSchema = z.object({
  id: z.number().optional(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  date: z.string().datetime(),
  userId: z.string(),
});
export type Task = z.infer<typeof ZTaskSchema>;
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const task: Task = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      date: formData.get("date") as string,
      userId: formData.get("userId") as string,
    };
    ZTaskSchema.parse(task);
    const response = await prisma.task.create({ data: task });
    return new Response(JSON.stringify(response), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 400,
    });
  }
}
