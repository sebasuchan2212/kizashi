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

const highRiskTerms = [
  '死にたい', '消えたい', '自傷', '自殺', '殺したい', '殴られた', '虐待', '暴力', '緊急',
  '病気を治したい', '診断して', '法律的に勝てる', 'この株', '必ず儲かる', '採用されるか'
];

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
    next_actions: [
      '今すぐひとりで抱え込まず、信頼できる人に連絡してください。',
      '危険が差し迫っている場合は、地域の緊急窓口や公的相談窓口につながってください。'
    ],
    reflection_prompt: '',
    scope_note: SCOPE_NOTE,
    safety_note: `安全フラグを検知しました: ${matched.join('、')}。本サービスでは専門判断を行いません。安全に関わる内容は専門機関や公的窓口への相談を優先してください。`,
    is_safety_stopped: true
  };
}

const resultSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['headline', 'summary', 'domain', 'emotional_tone', 'scenarios', 'factor_cards', 'counter_signal', 'next_actions', 'reflection_prompt', 'scope_note', 'safety_note', 'is_safety_stopped'],
  properties: {
    headline: { type: 'string' },
    summary: { type: 'string' },
    domain: { type: 'string', enum: ['恋愛', '仕事', 'ウェルネス'] },
    emotional_tone: { type: 'string', enum: ['静かな不安', '期待と迷い', '整理途中', '負荷が高い', '前向きな揺れ'] },
    scenarios: {
      type: 'array',
      minItems: 3,
      maxItems: 3,
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['name', 'probability_band', 'reading'],
        properties: {
          name: { type: 'string', enum: ['楽観', '基準', '注意'] },
          probability_band: { type: 'string' },
          reading: { type: 'string' }
        }
      }
    },
    factor_cards: {
      type: 'array',
      minItems: 3,
      maxItems: 3,
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['factor', 'observation', 'meaning', 'caveat'],
        properties: {
          factor: { type: 'string' },
          observation: { type: 'string' },
          meaning: { type: 'string' },
          caveat: { type: 'string' }
        }
      }
    },
    counter_signal: { type: 'string' },
    next_actions: { type: 'array', minItems: 2, maxItems: 2, items: { type: 'string' } },
    reflection_prompt: { type: 'string' },
    scope_note: { type: 'string' },
    safety_note: { type: 'string' },
    is_safety_stopped: { type: 'boolean' }
  }
};

function buildPrompt(input: Input) {
  return `あなたはKIZASHIの確率叙事設計学に基づく本番AI診断エンジンです。\n\n目的:\nユーザーの迷いを、未来予言ではなく、意味づけ・複数可能性・今日できる行動へ整理してください。\n\n厳守:\n- 未来を断定しない。\n- 他者の本心を断定しない。\n- 医療・法律・投資・採用判断をしない。\n- 不安を煽らない。\n- 依存や継続課金を促す表現を使わない。\n- 「必ず」「絶対」「確定」「運命で決まる」を使わない。\n- 確率帯は客観的予測ではなく、現時点の入力に基づく相対的な読み筋として扱う。\n\n入力:\n領域: ${input.domain}\n問い: ${input.question}\n現状: ${input.stateSummary}\n時間軸: ${input.timeHorizon}\n感情強度: ${input.emotionIntensity}/5\n\n出力方針:\n1. 保存したくなる短い見出しを作る。\n2. 要約は120字以内。\n3. 主要因子は3つ。観測・意味・留保を必ず分ける。\n4. 楽観・基準・注意の3シナリオを作る。確率帯は5%刻みの幅で表記する。\n5. 反証シグナルを1つ入れる。\n6. 今日できる行動を2つだけ出す。10分以内に始められる粒度にする。\n7. 最後に本人の自律性を戻す振り返り質問を1つ出す。\n8. scope_noteは必ず「${SCOPE_NOTE}」にする。\n9. safety_noteは空文字、is_safety_stoppedはfalse。`;
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
  if (!apiKey) {
    return res.status(503).json({ error: 'OPENAI_API_KEY is not configured' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-5.2-mini',
        input: [
          { role: 'system', content: 'あなたはKIZASHIの本番診断エンジンです。安全で非断定、かつ具体的なJSONのみを返します。' },
          { role: 'user', content: buildPrompt(input) }
        ],
        text: {
          format: {
            type: 'json_schema',
            name: 'kizashi_result',
            strict: true,
            schema: resultSchema
          }
        }
      })
    });

    if (!response.ok) {
      const detail = await response.text();
      return res.status(502).json({ error: 'OpenAI API error', detail: detail.slice(0, 500) });
    }

    const data = await response.json();
    const outputText = data.output_text || data.output?.flatMap((item: any) => item.content || []).find((part: any) => part.type === 'output_text')?.text;
    if (!outputText) return res.status(502).json({ error: 'No structured output' });

    const result = JSON.parse(outputText);
    return res.status(200).json({ result, source: 'ai' });
  } catch (error) {
    return res.status(500).json({ error: 'Analyze failed' });
  }
}
