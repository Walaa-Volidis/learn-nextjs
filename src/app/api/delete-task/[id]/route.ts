import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  await prisma.task.delete({
    where: {
      id: parseInt(params.id, 10),
    },
  });

  return NextResponse.json({ message: "Task successfully deleted" });
}
