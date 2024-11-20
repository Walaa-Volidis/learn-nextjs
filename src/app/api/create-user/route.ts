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
    console.log("request", request);
    const user = ZUserSchema.parse(await request.json());
    const response = await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        email: user.email,
      },
      create: {
        ...user,
      },
    });
    return new Response(JSON.stringify(response), { status: 201 });
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify({
        error: "An error occurred while creating or updating user",
      }),
      {
        status: 400,
      }
    );
  }
}
