export const config = { runtime: 'edge' };

export default async function handler(req) {
  const { b64, mime } = await req.json();

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: 'JSONのみ返してください（Markdownなし）: {"name":"ひらがな短い単語","emoji":"絵文字1つ","label":"カテゴリ"}' }],
        },
        contents: [{
          role: 'user',
          parts: [
            { inline_data: { mime_type: mime, data: b64 } },
            { text: 'この写真の主な物を教えてください。' },
          ],
        }],
        generationConfig: { maxOutputTokens: 200 },
      }),
    }
  );

  const data = await res.json();
  if (!res.ok) return new Response(JSON.stringify({ error: data.error?.message }), { status: 500 });

  const txt = data.candidates[0].content.parts[0].text.replace(/```json|```/g, '').trim();
  return new Response(JSON.stringify(JSON.parse(txt)), {
    headers: { 'Content-Type': 'application/json' },
  });
}