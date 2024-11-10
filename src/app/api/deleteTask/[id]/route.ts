import prisma from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.task.delete({
      where: {
        id: parseInt(params.id, 10),
      },
    });

    return new Response(JSON.stringify("this task deleted successfully"), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 400,
    });
  }
}
