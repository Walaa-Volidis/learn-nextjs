import { z } from "zod";

export const ZServerSettings = z.object({
  publicApiEndpoint: z.string(),
  clerk: z.object({
    publishableKey: z.string(),
    secretKey: z.string(),
    signInUrl: z.string(),
    signUpUrl: z.string(),
  }),
  groqApiKey: z.string(),
  baseUrl: z.string(),
});

export const SERVER_SETTINGS = ZServerSettings.parse({
  publicApiEndpoint: process.env["NEXT_PUBLIC_API_URL"],
  clerk: {
    publishableKey: process.env["NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"],
    secretKey: process.env["CLERK_SECRET_KEY"],
    signInUrl: process.env["NEXT_PUBLIC_CLERK_SIGN_IN_URL"],
    signUpUrl: process.env["NEXT_PUBLIC_CLERK_SIGN_UP_URL"],
  },
  groqApiKey: process.env["GROQ_API_KEY"],
  baseUrl: process.env["DATABASE_URL"],
});
