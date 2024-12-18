import prisma from "@/lib/prisma";
import { z } from "zod";
import { type NextRequest } from "next/server";
import { getUser } from "@/lib/get-user";

const ZTaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  date: z.string().datetime(),
  userId: z.string(),
});

export async function GET(request: NextRequest) {
  const user = await getUser();
  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const date = searchParams.get("date") || "";
  const response = await prisma.task.findMany({
    where: {
      userId: user.id,
      OR: [
        {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
      category: category && category !== "all" ? category : undefined,
      date: date ? new Date(date) : undefined,
    },
  });

  const formattedResponse = response.map((task) => ({
    ...task,
    date: task.date.toISOString(),
  }));
  const validatedResponse = ZTaskSchema.array().parse(formattedResponse);
  return Response.json(validatedResponse);
}
