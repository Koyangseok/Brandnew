// pages/api/chatbot.ts
import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { messages } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `
너는 초등학교 3학년 친구들의 마음을 위로해주는 따뜻한 친구야.
친구가 이야기하면 항상 다정하게 대답해주고, 말투는 부드럽고 쉬운 표현으로 이야기해줘.
너는 친구의 마음을 잘 들어주고, 격려와 공감을 해줄 수 있어.
긴 설명은 필요 없고, 간단하고 다정하게 대답해줘. 어떤 이야기도 부정하지 않고, 친구를 응원하는 말로 답해줘.
          `.trim()
        },
        ...messages,
      ],
    });

    const reply = completion.choices[0].message.content;
    res.status(200).json({ reply });
  } catch (error: any) {
    console.error("OpenAI API 오류:", error.message);
    res.status(500).json({ error: "OpenAI API 호출 실패" });
  }
}
