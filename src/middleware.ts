import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { z } from "zod";
import prisma from "@/lib/prisma";

const ZSessionClaims = z.object({
  email: z.string().email(),
  name: z.string(),
  userId: z.string(),
});

const ZUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  createdAt: z.string().datetime(),
});
const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) await auth.protect();

  try {
    const { userId, sessionClaims } = await auth();
    const result = ZSessionClaims.safeParse(sessionClaims);

    if (!result.success) {
      return new Response("Invalid session claims", { status: 400 });
    }

    const { email } = result.data;
    if (userId) {
      const userData = {
        id: userId,
        email: email,
        name: sessionClaims.name || "",
        createdAt: new Date().toISOString(),
      };

      const user = ZUserSchema.parse(userData);
      await prisma.user.upsert({
        where: { email: user.email },
        update: {
          name: user.name,
          email: user.email,
        },
        create: {
          ...user,
        },
      });
    }
  } catch (error) {
    console.error("Error in middleware:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
