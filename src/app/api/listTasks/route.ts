import prisma from "@/lib/prisma";
import { z } from "zod";

const ZTaskSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  date: z.string().datetime(),
  userId: z.string(),
});

export async function GET() {
  const response = await prisma.task.findMany();

  const formattedResponse = response.map((task) => ({
    ...task,
    date: task.date.toISOString(),
  }));

  const tasksArray = ZTaskSchema.array();
  const validatedResponse = tasksArray.parse(formattedResponse);
  return Response.json(validatedResponse);
}
