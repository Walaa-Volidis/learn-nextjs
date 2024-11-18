import prisma from "@/lib/prisma";
import { z } from "zod";

const ZUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  createdAt: z.string().datetime(),
});

export async function POST(request: Request) {
  try {
    const user = ZUserSchema.parse(await request.json());
    const response = await prisma.user.create({ data: user });
    return new Response(JSON.stringify(response), { status: 201 });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 400,
    });
  }
}
