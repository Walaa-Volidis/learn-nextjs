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
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const formData = await request.formData();
    const task = ZTaskSchema.parse({
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      date: formData.get("date") as string,
      userId: formData.get("userId") as string,
    });
    const updatedTask = await prisma.task.update({
      where: {
        id: parseInt(params.id, 10),
      },
      data: {
        ...task,
      },
    });
    return new Response(JSON.stringify(updatedTask), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 400,
    });
  }
}
