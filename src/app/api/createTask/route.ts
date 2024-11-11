import prisma from "@/lib/prisma";
import { z } from "zod";

const ZTaskSchema = z.object({
  title: z.string(),
  description: z.string(),
  category: z.string(),
  date: z.string().datetime(),
  userId: z.string(),
});
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const task = ZTaskSchema.parse({
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      date: new Date(formData.get("date") as string).toISOString(),
      userId: formData.get("userId") as string,
    });
    const response = await prisma.task.create({ data: task });
    return new Response(JSON.stringify(response), { status: 201 });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 400,
    });
  }
}
