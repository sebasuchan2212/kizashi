# KIZASHI Complete MVP

KIZASHIは、未来を断定しない自己省察型占いWebアプリです。  
独自フレーム「確率叙事設計学 / 確率叙事占学」に基づき、恋愛・仕事・ウェルネスの迷いを、3つのシナリオ、主要因子、反証シグナル、今日できる行動に整理します。

## 実装内容

- React + TypeScript + Vite
- スマホファーストUI
- オブジェクト指向寄りの診断エンジン
- `KizashiAnalyzer` クラスを中心に処理を分割
- 安全判定 `SafetyChecker`
- 要約 `TextSummarizer`
- 感情トーン分類 `EmotionalToneClassifier`
- 因子生成 `FactorLibrary`
- シナリオ生成 `ScenarioGenerator`
- 反証生成 `CounterSignalBuilder`
- 行動提案 `ActionPlanner`
- JSONコピー機能
- 高リスク語句検出時の通常診断停止
- 常時表示の免責文

## 起動方法

```bash
npm install
npm run dev
```

ブラウザで次を開きます。

```bash
http://localhost:5173
```

## ビルド確認

```bash
npm run build
```

## 重要ファイル

```text
src/domain/types.ts                  型定義
src/domain/constants.ts              定数・禁止語・安全語
src/engine/KizashiAnalyzer.ts        診断エンジン本体
src/engine/SafetyChecker.ts          安全停止判定
src/engine/FactorLibrary.ts          ドメイン別主要因子
src/engine/ScenarioGenerator.ts      3シナリオ生成
src/engine/ActionPlanner.ts          今日できる行動
src/services/mockAnalyzeKizashi.ts   UIから呼ぶ分析関数
src/components/InputForm.tsx         入力フォーム
src/components/ResultView.tsx        結果表示
src/styles.css                       デザイン
```

## 将来のAI API差し替え方

現在は `src/services/mockAnalyzeKizashi.ts` がローカルの `KizashiAnalyzer` を呼び出しています。

将来的にOpenAI API等へ接続する場合は、以下のように差し替えます。

1. `KizashiResult` のJSON形式は固定する
2. サーバー側API `/api/analyze` を作る
3. `mockAnalyzeKizashi()` を `fetch('/api/analyze')` に置き換える
4. API側で安全判定を必ず最上流に置く
5. LLM出力はJSON Schemaで検証してからフロントに返す

## 注意

本アプリは自己理解と行動整理の補助を目的としたMVPです。  
医療・法律・投資・採用判断、未来や他者の意思の断定は行いません。

## Vercel deploy note

This package intentionally does not include `package-lock.json` to avoid environment-specific registry URLs. On Vercel, use:

- Framework Preset: Vite
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: `dist`
- Node.js Version: 20.x

If Vercel shows `npm error Exit handler never called`, delete `package-lock.json` from the repository and redeploy with the pinned `package.json` in this version.
