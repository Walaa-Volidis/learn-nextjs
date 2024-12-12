import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { z } from "zod";

const ZSessionClaims = z.object({
  email: z.string().email(),
  name: z.string(),
});

const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
    //return;
  }
  console.log("hey", process.env);
  const { sessionClaims, getToken } = await auth();
  if (sessionClaims) {
    const { email, name } = ZSessionClaims.parse(sessionClaims);

    const token = await getToken();
    await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}upsert-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ email, name }),
    });
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
