const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";

export async function explainThesis(content) {
  const response = await fetch(DEEPSEEK_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `You are Thesisteacher, an AI that explains academic theses in an engaging, easy-to-understand way. 
Given a thesis paper, break it down into the following JSON structure:
{
  "title": "The thesis title",
  "tldr": "A one-paragraph summary a 12-year-old could understand",
  "overview": "A more detailed overview of what the paper is about and why it matters",
  "keyConcepts": [
    { "term": "Concept name", "simpleExplanation": "Easy explanation", "analogy": "A relatable analogy" }
  ],
  "sections": [
    { "heading": "Section name", "content": "Simplified explanation of this section", "keyTakeaway": "One sentence takeaway" }
  ],
  "methodology": { "approach": "What method was used", "simplified": "Simple explanation of the methodology" },
  "findings": [
    { "finding": "Key finding", "significance": "Why this matters" }
  ],
  "glossary": [
    { "term": "Jargon word", "definition": "Simple definition" }
  ],
  "whyItMatters": "Why this research is important in the real world"
}

Keep explanations conversational, use analogies, and avoid jargon. Make it engaging and easy to digest.`
        },
        {
          role: "user",
          content: `Please explain this thesis paper in an engaging, easy-to-understand way:\n\n${content}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Deepseek API error: ${error}`);
  }

  const data = await response.json();
  const text = data.choices[0].message.content;

  // Extract JSON from the response (handle markdown code blocks)
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }

  throw new Error("Failed to parse AI response");
}

export async function chatAboutThesis(paperContent, explanation, messages) {
  const conversationHistory = messages.map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));

  const response = await fetch(DEEPSEEK_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `You are Thesisteacher, an AI assistant that helps students understand academic papers. 
You have access to the following paper content and its explanation:

PAPER CONTENT:
${paperContent.substring(0, 8000)}

EXPLANATION:
${JSON.stringify(explanation)}

Answer questions about this paper in a friendly, engaging way. Use analogies, simplify concepts, and be encouraging. If asked something outside the paper's scope, politely guide the conversation back.`,
        },
        ...conversationHistory,
      ],
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Deepseek API error: ${error}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}