---
title: "Remotion × React: アニメーションコンポーネントを共通化・再利用する最新パターン"
emoji: "🎨"
type: "tech"
topics: ["remotion", "react", "typescript", "css", "webdevelopment"]
published: true
---

Remotion で動画を作っていくと、タイトルカード、プログレスバー、ネオンフレームなど **「毎回使うUIパーツ」** が増えてきます。

今回は、動画編集ソフトのプリセットのように、React コンポーネントを Remotion で再利用可能にする設計パターンとパラメータ設計についてまとめました。

---

## 1. 再利用可能なフレームアセットコンポーネントの設計

Remotion では、動画の1フレームごとに変わるイージング数値を `useCurrentFrame()` で取得し、共通コンポーネントの props として渡します。

```tsx
import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';

interface AnimatedCardProps {
  title: string;
  subtitle: string;
  delayFrame?: number;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  title,
  subtitle,
  delayFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame: frame - delayFrame,
    fps,
    config: { stiffness: 120, damping: 14 },
  });

  return (
    <div
      style={{
        transform: `scale(${Math.max(0, scale)})`,
        padding: '2rem',
        borderRadius: '16px',
        background: 'rgba(15, 23, 42, 0.8)',
        border: '1px solid rgba(56, 189, 248, 0.3)',
      }}
    >
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </div>
  );
};
```

---

## 2. 実験結果と分かったこと

* **遅延表示（Staggered Animation）が超簡単**: `delayFrame` を引数にするだけで、カードA→カードB→カードC と連続で飛び出すアニメーションが1行で書けます。
* **テーマの統一**: Tailwind や CSS Variables を使えば、1つのカラーテーマ変更で全シーンのネオンカラーを一括変更できます。

React Developer にとって、After Effects の複雑なキーフレームよりも直感的で管理しやすいのが最大の強みです。
