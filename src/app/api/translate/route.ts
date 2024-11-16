import { NextResponse } from "next/server";
import Client from "groq-sdk";
const client = new Client({
  apiKey: process.env.GROQ_API_KEY || "",
});

export async function POST(req: Request) {
  const body = await req.json();
  const { arabicText } = body;

  if (!arabicText) {
    return NextResponse.json(
      { error: "Arabic text is required" },
      { status: 400 }
    );
  }

  try {
    const response = await client.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [
        {
          role: "system",
          content:
            "You are a professional translator. Translate Arabic text to English without providing any additional explanations or details.",
        },
        { role: "user", content: arabicText },
      ],
    });

    const translatedText = response.choices[0]?.message?.content?.trim() || "";
    return NextResponse.json({ translatedText });
  } catch {
    return NextResponse.json({ error: "Translation failed" }, { status: 500 });
  }
}
