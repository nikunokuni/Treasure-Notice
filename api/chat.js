export const config = { runtime: 'edge' };

export default async function handler(req) {
  const { messages, system } = await req.json();

  // ── Gemini は user→model→user…と交互でないとエラー ──
  // 1) assistant→model に変換
  let contents = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  // 2) 先頭が model になってしまう場合はダミーの user を追加
  if (contents.length > 0 && contents[0].role === 'model') {
    contents.unshift({ role: 'user', parts: [{ text: 'はじめてください' }] });
  }

  // 3) 同じロールが連続している場合は結合する
  const merged = [];
  for (const turn of contents) {
    const prev = merged[merged.length - 1];
    if (prev && prev.role === turn.role) {
      // 同ロールは parts を結合
      prev.parts.push(...turn.parts);
    } else {
      merged.push({ role: turn.role, parts: [...turn.parts] });
    }
  }

  // 4) 最後が model で終わっていたら除去（Geminiは最後がuserである必要がある）
  if (merged.length > 0 && merged[merged.length - 1].role === 'model') {
    merged.pop();
  }

  // 5) 空になってしまったら最低限のメッセージを入れる
  if (merged.length === 0) {
    merged.push({ role: 'user', parts: [{ text: 'こんにちは' }] });
  }

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: system }] },
        contents: merged,
        generationConfig: { maxOutputTokens: 1000 },
      }),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    const msg = data.error?.message || JSON.stringify(data);
    console.error('Gemini API error:', msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // candidates が空の場合のガード
  const candidate = data.candidates?.[0];
  if (!candidate) {
    return new Response(JSON.stringify({ error: 'no candidates returned' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // finish_reason が SAFETY などでブロックされた場合
  if (candidate.finishReason && candidate.finishReason !== 'STOP' && candidate.finishReason !== 'MAX_TOKENS') {
    return new Response(JSON.stringify({ error: `blocked: ${candidate.finishReason}` }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const text = candidate.content?.parts?.[0]?.text ?? '';
  return new Response(JSON.stringify({ text }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
