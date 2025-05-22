
export default async function handler(req, res) {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "텍스트가 없습니다." });
  }

  const trimmed = text.trim().slice(0, 1000); // 글자수 제한 (예: 500자)

  const prompt = `
다음은 사용자가 작성한 일기입니다. 이 글을 바탕으로 사용자의 감정적 특성과 심리 상태를 분석해 주세요.

다음 JSON 형식으로만 정확히 출력해 주세요:

- type: 분석된 성향 키워드 (예: INFP, ESTJ 등)
- title: 성향을 동물로 비유한 이름
- description: 분석된 성향을 설명해줘. 그리고 그 성향을 가진 사람들이 어떤 직업을 주로 갖는 지 알려줘
- scores: 스트레스, 불안감, 우울감, 열등감 각각을 1~5 점수로 추정

글:
"\${trimmed}"

출력 형식 예시 (내용은 입력에 맞게 변경):
{
  "type": "ENFP",
  "title": "열정적이고 창의적인 연예인(사슴)",
  "description": ENFP는 매우 활기차고 호기심이 많은 타입이야. 너는 오늘 아침 알람 없이 일어나서 기분이 좋았고 하루 종일 긍정적인 에너지를 느꼈다는 점에서 ENFP 특성을 잘 보여줘. 이 탑은 상상력이 풍부하고 사람들과의 관계에서 기쁨을 찾는 경우가 많지. 너에게 어울리는 직업으로는 유튜버가 딱이야. 너는 새로운 아이디어와 사람들에게 긍정",
  "scores": {
    "스트레스": 3,
    "불안감": 2,
    "우울감": 1,
    "열등감": 2
  }
}
JSON만 반환해 주세요. 코드 블록 없이.
`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
    }),
  });

  const json = await response.json();
  const content = json.choices?.[0]?.message?.content;

  console.log("📦 GPT 응답 원본:", content);

  if (!content) {
    return res.status(500).json({ error: 'OpenAI 응답 형식 이상', raw: json });
  }

  const cleanedContent = content
    .replace(/^```json\s*/i, '')
    .replace(/^```/, '')
    .replace(/```$/, '')
    .trim();

  try {
    const data = JSON.parse(cleanedContent);

    if (
      !data.type || typeof data.type !== 'string' ||
      !data.title || typeof data.title !== 'string' ||
      !data.description || typeof data.description !== 'string' ||
      !data.scores || typeof data.scores !== 'object'
    ) {
      return res.status(500).json({ error: '응답 형식 오류', raw: data });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("❌ JSON 파싱 실패:", cleanedContent);
    res.status(500).json({ error: 'GPT 응답 파싱 실패', raw: cleanedContent });
  }
}
