// import prisma from "@/lib/prisma";
// import { NextRequest, NextResponse } from "next/server";

// export async function DELETE(
//   request: NextRequest,
//   context: { params: Promise<{ id: string }> } // Wrap params in a Promise
// ) {
//   try {
//     const { id } = await context.params; // Await the params if it's a Promise
//     const deletedTask = await prisma.task.delete({
//       where: {
//         id: parseInt(id, 10),
//       },
//     });

//     return NextResponse.json(deletedTask, { status: 200 });
//   } catch (error) {
//     console.error("Error deleting task:", error);
//     return NextResponse.json(
//       { error: "An error occurred while deleting the task" },
//       { status: 400 }
//     );
//   }
// }
