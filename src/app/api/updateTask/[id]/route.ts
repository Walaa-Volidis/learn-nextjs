import prisma from "@/lib/prisma";
import { z } from "zod";
import { NextResponse } from "next/server";

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
      title: formData.get("title"),
      description: formData.get("description"),
      category: formData.get("category"),
      date: formData.get("date"),
      userId: formData.get("userId"),
    });
    const updatedTask = await prisma.task.update({
      where: {
        id: parseInt(params.id, 10),
      },
      data: {
        ...task,
      },
    });
    return NextResponse.json(updatedTask, { status: 200 });
  } catch (error) {
    console.error("Error updating task:", error); 
    return NextResponse.json(
      { error: "An error occurred while updating the task" },
      { status: 400 }
    );
  }
}
