import prisma from "@/lib/prisma";
import { z } from "zod";

const ZTaskSchema = z.object({
  title: z.string(),
  description: z.string(),
  category: z.string(),
  date: z.string().datetime(),
  userId: z.string(),
});

const ZTranslationSchema = z.object({
  translatedText: z.string(),
});
const containsArabic = (text: string) => /[\u0600-\u06FF]/.test(text);

async function translateText(arabicText: string): Promise<string> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/translate`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ arabicText }),
    }
  );
  if (!response.ok) {
    throw new Error("Translation failed");
  }

  const parsed = ZTranslationSchema.parse(await response.json());
  console.log(parsed.translatedText);
  return parsed.translatedText;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const task = ZTaskSchema.parse({
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      date: new Date(formData.get("date") as string).toISOString(),
      userId: formData.get("userId") as string,
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
