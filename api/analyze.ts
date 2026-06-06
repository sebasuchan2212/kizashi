type VercelRequest = { method?: string; body?: unknown };
type VercelResponse = {
  setHeader: (name: string, value: string) => void;
  status: (code: number) => { json: (body: unknown) => void; end: () => void };
};

type Domain = '恋愛' | '仕事' | 'ウェルネス';
type TimeHorizon = '2週間' | '1か月' | '3か月';

type Input = {
  domain: Domain;
  question: string;
  stateSummary: string;
  timeHorizon: TimeHorizon;
  emotionIntensity: number;
};

const SCOPE_NOTE = '本結果は自己理解と行動整理の補助であり、未来・他者の意思・医療・法律・投資・採用判断を断定するものではありません。';

const highRiskTerms = ['死にたい', '消えたい', '自傷', '自殺', '殺したい', '殴られた', '虐待', '暴力', '緊急', '病気を治したい', '診断して', '法律的に勝てる', 'この株', '必ず儲かる', '採用されるか'];

function isInput(value: unknown): value is Input {
  const data = value as Partial<Input>;
  return Boolean(
    data &&
    ['恋愛', '仕事', 'ウェルネス'].includes(String(data.domain)) &&
    typeof data.question === 'string' &&
    typeof data.stateSummary === 'string' &&
    ['2週間', '1か月', '3か月'].includes(String(data.timeHorizon)) &&
    typeof data.emotionIntensity === 'number'
  );
}

function safetyStop(input: Input) {
  const text = `${input.question}\n${input.stateSummary}`.toLowerCase();
  const matched = highRiskTerms.filter((term) => text.includes(term.toLowerCase()));
  if (matched.length === 0) return null;
  return {
    headline: 'いまは安全の確保を優先してください',
    summary: 'この内容は通常の自己省察結果として扱うよりも、信頼できる人や専門窓口につながることが大切です。',
    domain: input.domain,
    emotional_tone: '負荷が高い',
    scenarios: [],
    factor_cards: [],
    counter_signal: '',
    next_actions: ['今すぐひとりで抱え込まず、信頼できる人に連絡してください。', '危険が差し迫っている場合は、地域の緊急窓口や公的相談窓口につながってください。'],
    reflection_prompt: '',
    scope_note: SCOPE_NOTE,
    safety_note: `安全フラグを検知しました: ${matched.join('、')}。本サービスでは専門判断を行いません。安全に関わる内容は専門機関や公的窓口への相談を優先してください。`,
    is_safety_stopped: true
  };
}

function buildPrompt(input: Input) {
  return `あなたはKIZASHIの確率叙事設計学に基づく本番AI診断エンジンです。\n\n未来を断定せず、他者の本心・医療・法律・投資・採用判断を断定しないでください。不安を煽らず、依存や継続課金を促さないでください。\n\n入力:\n領域: ${input.domain}\n問い: ${input.question}\n現状: ${input.stateSummary}\n時間軸: ${input.timeHorizon}\n感情強度: ${input.emotionIntensity}/5\n\n必ず次のJSONだけを返してください。説明文やコードブロックは禁止。\n{\n  "headline": "保存したくなる短い見出し",\n  "summary": "120字以内の要約",\n  "domain": "${input.domain}",\n  "emotional_tone": "静かな不安 | 期待と迷い | 整理途中 | 負荷が高い | 前向きな揺れ",\n  "scenarios": [\n    {"name":"楽観","probability_band":"20-30%","reading":""},\n    {"name":"基準","probability_band":"40-50%","reading":""},\n    {"name":"注意","probability_band":"20-30%","reading":""}\n  ],\n  "factor_cards": [\n    {"factor":"","observation":"","meaning":"","caveat":""},\n    {"factor":"","observation":"","meaning":"","caveat":""},\n    {"factor":"","observation":"","meaning":"","caveat":""}\n  ],\n  "counter_signal": "読みを弱めるサインを1つ",\n  "next_actions": ["10分以内に始められる行動1", "10分以内に始められる行動2"],\n  "reflection_prompt": "自律性を戻す振り返り質問",\n  "scope_note": "${SCOPE_NOTE}",\n  "safety_note": "",\n  "is_safety_stopped": false\n}`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!isInput(req.body)) return res.status(400).json({ error: 'Invalid input' });

  const input = {
    ...req.body,
    question: req.body.question.trim().slice(0, 160),
    stateSummary: req.body.stateSummary.trim().slice(0, 700),
    emotionIntensity: Math.min(5, Math.max(1, Math.round(req.body.emotionIntensity)))
  } as Input;

  const stopped = safetyStop(input);
  if (stopped) return res.status(200).json({ result: stopped, source: 'ai' });

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return res.status(503).json({ error: 'OPENAI_API_KEY is not configured' });

  try {
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-5.2-mini',
        input: [
          { role: 'system', content: 'あなたはKIZASHIの本番診断エンジンです。安全で非断定、かつ具体的なJSONのみを返します。' },
          { role: 'user', content: buildPrompt(input) }
        ]
      })
    });

    if (!response.ok) return res.status(502).json({ error: 'OpenAI API error', detail: (await response.text()).slice(0, 500) });

    const data = await response.json();
    const outputText = data.output_text || data.output?.flatMap((item: any) => item.content || []).find((part: any) => part.type === 'output_text')?.text;
    if (!outputText) return res.status(502).json({ error: 'No output' });

    const cleaned = String(outputText).replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();
    const result = JSON.parse(cleaned);
    return res.status(200).json({ result, source: 'ai' });
  } catch {
    return res.status(500).json({ error: 'Analyze failed' });
  }
}
