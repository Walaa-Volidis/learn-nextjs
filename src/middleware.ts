import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/fastify";

const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
    try {
      const { userId } = await auth();

      if (userId) {
        const user = userId ? await clerkClient.users.getUser(userId) : null;
        if (user) {
          const userData = {
            id: userId,
            email: user.emailAddresses[0].emailAddress || "",
            name: user.firstName || "",
            createdAt: new Date().toISOString(),
          };
          console.log("userData", userData);
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/create-user`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
          });
        }
      }
    } catch (error) {
      console.error("Error creating or retrieving user:", error);
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
