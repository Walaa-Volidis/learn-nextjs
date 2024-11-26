import prisma from "@/lib/prisma";
import { z } from "zod";
import { SERVER_SETTINGS } from "@/settings";
import Client from "groq-sdk";

const ZTaskSchema = z.object({
  title: z.string(),
  description: z.string(),
  category: z.string(),
  date: z.string().datetime(),
  userId: z.string(),
});

const client = new Client({
  apiKey: SERVER_SETTINGS.groqApiKey || "",
});

const containsArabic = (text: string) => /[\u0600-\u06FF]/.test(text);

async function translateText(arabicText: string): Promise<string> {
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
  return translatedText;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const task = ZTaskSchema.parse({
      title: formData.get("title"),
      description: formData.get("description"),
      category: formData.get("category"),
      date: new Date(formData.get("date") as string).toISOString(),
      userId: formData.get("userId"),
    });

    const translationPromises = [];
    if (containsArabic(task.title)) {
      translationPromises.push(
        translateText(task.title).then(
          (translatedText) => (task.title = translatedText)
        )
      );
    }
    if (containsArabic(task.description)) {
      translationPromises.push(
        translateText(task.description).then(
          (translatedText) => (task.description = translatedText)
        )
      );
    }
    await Promise.all(translationPromises);

    const response = await prisma.task.create({ data: task });
    return new Response(JSON.stringify(response), { status: 201 });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 400,
    });
  }
}
