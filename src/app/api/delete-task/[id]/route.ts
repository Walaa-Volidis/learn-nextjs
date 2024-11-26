import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await params;
    const deletedTask = await prisma.task.delete({
      where: {
        id: id,
      },
    });
    return NextResponse.json(deletedTask, { status: 200 });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json(
      { error: "An error occurred while deleting the task" },
      { status: 400 }
    );
  }
}
