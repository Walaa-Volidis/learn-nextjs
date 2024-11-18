import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { getAuth } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    try {
      const { userId, getToken } = getAuth(request);
     
      if (userId) {
        const user = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }).then((res) => res.json());

        if (user) {
          const userData = {
            id: userId,
            email: user.email_addresses[0].email_address,
            name: user.full_name || "",
            createdAt: new Date().toISOString(),
          };
        console.log(user);
          await fetch("/api/create-user", {
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
