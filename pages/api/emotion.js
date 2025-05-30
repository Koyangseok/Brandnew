export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { text } = req.body;
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ message: 'OpenAI API 키가 설정되어 있지 않습니다.' });
  }

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ message: '유효한 텍스트가 필요합니다.' });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `다음 문장의 감정을 아래 목록 중 **가장 가까운 하나만** 골라서 **정확히 아래 단어 중 하나만 반환하세요.**
다른 설명이나 단어는 절대 포함하지 마세요. 목록 외 감정은 말하지 마세요.

가능한 감정 목록:
기쁨, 슬픔, 화남, 불안, 사랑, 자신감, 눈물, 피곤함,
당황, 혐오, 설렘, 불편함, 혼란, 평온함, 고민중, 위로, 무감정, 격노, 열망, 스트레스`
          },
          {
            role: "user",
            content: text,
          },
        ],
        temperature: 0.3,
      }),
    });

    const data = await response.json();
    let rawEmotion = data.choices?.[0]?.message?.content?.trim();

    if (!rawEmotion) {
      return res.status(500).json({ message: '감정 분석 결과를 가져올 수 없습니다.' });
    }

    // 응답에서 첫 단어만 추출하여 감정 하나로 고정
    const emotion = rawEmotion.split(/[ ,.\n]/)[0];

    return res.status(200).json({ emotion });
  } catch (error) {
    return res.status(500).json({
      message: 'OpenAI 요청 중 오류 발생',
      error: error.message,
    });
  }
}
