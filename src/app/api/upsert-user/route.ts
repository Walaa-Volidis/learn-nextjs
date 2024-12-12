import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { name, email } = await request.json();
    await prisma.user.upsert({
      where: { email },
      update: {
        name,
        email,
      },
      create: {
        name,
        email,
      },
    });
    return NextResponse.json({ message: "User upserted successfully" });
  } catch (error) {
    console.error("Error upserting user:", error);
    return NextResponse.json(
      { error: "Failed to upsert user" },
      { status: 500 }
    );
  }
}
