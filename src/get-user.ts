import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import prisma from "@/lib/prisma";

const ZSessionClaims = z.object({
  email: z.string().email(),
});

export async function getUser() {
  const { sessionClaims } = await auth();

  const { email } = ZSessionClaims.parse(sessionClaims);

  const user = await prisma.user.findUniqueOrThrow({
    where: { email },
  });

  return user;
}
