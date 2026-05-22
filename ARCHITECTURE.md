# KIZASHI Architecture

## 処理フロー

1. `InputForm` がユーザー入力を受け取る
2. `App` が `mockAnalyzeKizashi()` を呼び出す
3. `KizashiAnalyzer` が以下を順番に実行する
   - `SafetyChecker`
   - `TextSummarizer`
   - `EmotionalToneClassifier`
   - `FactorLibrary`
   - `ScenarioGenerator`
   - `CounterSignalBuilder`
   - `ActionPlanner`
4. `ResultView` が `KizashiResult` をカードUIとして表示する

## OOP設計

各処理をクラスに分離しています。

- 安全判定を変えたい → `SafetyChecker`
- 因子ロジックを強化したい → `FactorLibrary`
- 確率帯を調整したい → `ScenarioGenerator`
- 行動提案を増やしたい → `ActionPlanner`
- AI APIに変えたい → `src/services/mockAnalyzeKizashi.ts`

## API化する場合

フロント側の型 `KizashiInput` / `KizashiResult` は固定したまま、`mockAnalyzeKizashi()` を非同期関数に変えます。

```ts
export async function analyzeKizashi(input: KizashiInput): Promise<KizashiResult> {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input)
  });

  if (!response.ok) throw new Error('診断に失敗しました。');
  return response.json();
}
```

サーバー側でも、必ず最初に安全判定を行ってください。
