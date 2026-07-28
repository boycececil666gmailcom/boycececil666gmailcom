---
title: "Remotion & React: Building Reusable Animated UI Components for Video Pipelines"
seoTitle: "Building Reusable UI Components in Remotion & React"
slug: "remotion-video-component-patterns"
tags: "react, typescript, remotion, web-development, css"
published: true
---

When building programmatic videos using **Remotion**, you quickly notice patterns: title cards, progress indicators, and glowing container frames are repeated across multiple scenes.

Here is a quick breakdown of how to structure reusable, physics-based animation components in Remotion using React and TypeScript.

---

## 1. Designing a Reusable Animated Card

By abstracting `delayFrame` into props, you can create staggered spring animations effortlessly:

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

## 2. Key Learnings & Takeaways

- **Staggered Animations**: Passing a `delayFrame` offset allows sequence items to pop up smoothly without manual keyframe editing.
- **Unified Design System**: CSS variables and theme providers make global style adjustments across 10+ scenes instant.

This component-driven workflow is a game-changer for React engineers producing automated video content.
