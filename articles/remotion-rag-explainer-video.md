---
title: "Reactで動画を作る！Remotionで「Enterprise RAG Engine」解説動画をプログラマブルに自動生成してみた結果と感想"
emoji: "🎬"
type: "tech"
topics: ["remotion", "react", "typescript", "rag", "frontend"]
published: true
---

最近、動画編集ソフトを起動せずに **「React のコードだけで解説動画をレンダリングする」** フレームワークである **Remotion** を試してみました。

今回は、AI / エンタープライズ技術解説として **「Enterprise RAG Engine」** のアーキテクチャを説明する動画（全4シーン、35秒構成）を全編 TypeScript + React で構築しました。

実際に動くものを作ってみて得られた成果、コードの工夫点、そして After Effects などの動画編集ソフトと比べた「正直な感想」をまとめます。

---

## 1. 今回試した技術と作ったもの

今回作成したのは、Enterprise RAG Engine の仕組みをスライド風・ダイナミックアセット風に紹介するプログラマブル動画です。

### 構成コンポーネント
- **Framework**: Remotion (v4) + React 18 + TypeScript
- **コンポーネント構造**:
  - `Scene1Banner`: タイトルとネオンデザインのアイキャッチ
  - `Scene2Specifications`: データソース・ベクトルDB・LLMパイプラインのスペック表
  - `Scene3ExecutionPipeline`: クエリ処理～検索～回答生成のパイプラインアニメーション
  - `Scene4Microservices`: システム構成マイクロサービス群のカードビュー

### 動画設定 (Remotion Composition)
```tsx
<Composition
  id="RAGExplainerVideo"
  component={RAGExplainerVideo}
  durationInFrames={1050} // 30fps x 35sec
  fps={30}
  width={1920}
  height={1080}
  defaultProps={{
    titleText: 'Enterprise RAG Engine',
    subtitleText: 'High-Performance Retrieval Augmented Generation',
  }}
/>
```

Zod による型安全な Prop スキーマ定義もサポートされているため、外部 API や DB からテキストを流し込んで動的に動画を自動生成することも可能です。

---

## 2. 実装の工夫と技術的成果

### 1) Sequence と フレーム単位制御
Remotion では `Sequence` コンポーネントを使って各シーンの開始フレームと表示長を定義します。

```tsx
<Sequence from={0} durationInFrames={150}>
  <Scene1Banner titleText={titleText} />
</Sequence>
<Sequence from={150} durationInFrames={300}>
  <Scene2Specifications />
</Sequence>
```

### 2) Spring アニメーションによる自然なモーション
CSS transition や タイムラインキーフレームの代わりに、`spring()` 関数を利用して数学的に滑らかな拡大・出現アニメーションを実現しました。

```tsx
const frame = useCurrentFrame();
const { fps } = useVideoConfig();

const scale = spring({
  frame,
  fps,
  config: { stiffness: 100, damping: 12 },
});
```

---

## 3. 実際に作ってみた正直な感想

### 良かった点 (Pros)
1. **Git で動画の変更履歴を完璧に管理できる**
   通常の動画プロジェクトファイル（.aep や .prproj）と違い、テキスト差分として GitHub で管理できます。「テロップの文字を1文字変える」「背景色を変える」といった変更が Pull Request 経由で完結するのが感動的です。
2. **コンポーネントの再利用性が圧倒的**
   一度デザインした「ネオンカード」や「プログレスバー」の React コンポーネントを、別の動画や別のプロジェクトでそのまま npm モジュールや共通ファイルとして使い回せます。
3. **動画の動的・大量自動生成（バッチ処理）の可能性**
   Zod スキーマで props を定義して CLI やサーバーからレンダーできるため、ユーザー名やデータを差し替えたパーソナライズ動画の大量自動生成が非常に簡単に構築できます。

### 苦労した点・課題 (Cons / Retrospective)
1. **イージング・タイミングの直感的微調整が難しい**
   GUI のタイムラインでドラッグ＆ドロップしてタイミングを調整するのに慣れていると、「フレーム数と `spring()` のパラメーターを数値で微調整する」開発スタイルには少し慣れが必要です。
2. **プレビューとレンダリングの重さ**
   ブラウザ上の Remotion Player でリアルタイムプレビューは快適ですが、複雑なグラデーション blur や大量の要素をアニメーションさせると、書き出し（`npx remotion render`）時に PC の GPU / CPU パワーをかなり消費します。

---

## まとめ：どんな場面で使うべきか？

「1回限りのクリエイティブなプロモーション動画」を作るのであれば After Effects や Premiere の方が直感的で早いかもしれません。

しかし、**「データやテキストに応じて自動的に生成したい動画」「デザインシステムを共通化したい解説動画シリーズ」「定期的なレポート動画の自動出力」** にとって、Remotion は現在最高の選択肢だと実感しました。

今後も AI によるシナリオ生成と組み合わせて、動画作成の自動化パイプラインを実験していこうと思います！
