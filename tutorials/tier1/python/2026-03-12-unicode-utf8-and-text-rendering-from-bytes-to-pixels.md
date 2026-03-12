# Unicode, UTF-8, and Text Rendering: From Bytes to Pixels

This article walks through how text works at every level of the stack — from how LLMs tokenize it, to what Unicode actually is, to how a font renderer turns code points into pixels on screen. It also covers a practical pseudocode renderer and how to handle text in a Python game engine.

---

## How LLMs Tokenize Text

When training on internet data, the pipeline looks like this:

```
UTF-8 bytes on disk  →  decode to Unicode string  →  tokenizer  →  token IDs
```

The files on disk are stored as UTF-8 bytes. Before tokenization, those bytes are decoded into a Unicode string (what Python calls `str`). The tokenizer then operates on that string — it sees characters like `あ`, `é`, `中`, not raw byte sequences.

### The Nuance: Byte-Level BPE

Some tokenizers (GPT-2, GPT-4's tiktoken) use **byte-level BPE**, which bottoms out at raw bytes — but in a specific way:

- The base vocabulary is the 256 possible byte values (0–255)
- BPE merges are then learned on top of those bytes
- So `é` (UTF-8: `0xC3 0xA9`) starts as two tokens `[0xC3, 0xA9]` before any merges

This is different from SentencePiece (used by LLaMA), which works at the Unicode character level and has an explicit `<unk>` for unseen characters.

**Why byte-level BPE?** Because it can represent any input without ever producing `<unk>`. Even a completely novel character degrades gracefully into its constituent bytes.

| Approach | Base unit | Example |
|---|---|---|
| Character-level | Unicode code point | `a`, `あ`, `é` |
| Byte-level BPE (GPT-2/4) | Raw byte (0–255) | `0xC3`, `0xA9` → merges → `é` |
| SentencePiece (LLaMA) | Unicode char + BPE | `▁the`, `は` |

In all cases, UTF-8 decoding happens before tokenization. The tokenizer never sees raw file bytes directly.

---

## What Unicode Is

Unicode is a giant standardized table that assigns a number to every character in every language. These numbers are called **code points**.

| Character | Code Point | Hex |
|---|---|---|
| A | 65 | U+0041 |
| あ | 12354 | U+3042 |
| 中 | 20013 | U+4E2D |
| é | 233 | U+00E9 |

That's all Unicode is — a mapping of character → number. In Python, `str` is a sequence of these code point integers:

```python
for c in "hello world":
    print(c, ord(c), hex(ord(c)))
# h 104 0x68
# e 101 0x65
# ...

print(ord("あ"))  # 12354
```

Since "hello world" is plain ASCII, the code points are just ASCII values (0–127). Unicode was designed to be backwards-compatible with ASCII in that range.

---

## What UTF-8 Is

UTF-8 is one way to encode Unicode code points as bytes for storage or transmission. UTF-16 and UTF-32 are other encodings of the same code points. The code points themselves are the "real" text — UTF-8 is just how you store them.

An analogy: a `.mp3` file is compressed audio on disk, but your player decodes it to raw PCM samples before processing. The PCM is the real audio — the mp3 is just the storage format. Similarly, UTF-8 is the storage format; the Unicode string is the actual text.

```
UTF-8 bytes (disk/network)
    → decode
    → Unicode string (in memory)
    → your program sees characters
```

---

## How Text Rendering Works

Once you have a Unicode string in memory, a text renderer turns it into pixels:

```
Unicode code points  +  font file  →  renderer  →  pixels on screen
```

The font file (`.ttf`, `.otf`) contains **vector shapes** (bezier curves) for each code point. The shapes are not pixels — they're mathematical descriptions of outlines, so fonts scale perfectly to any size.

The renderer:
1. Looks up the glyph (vector shape) for each code point
2. Rasterizes it — converts the vector curves into pixels at the requested size
3. Paints those pixels to the screen

**Why you see glyphs and not numbers:** your display system runs this pipeline automatically on every piece of text that appears on screen. The numbers (code points) are always there underneath — being interpreted for you.

### GPU vs CPU

Text rendering was historically CPU work but modern systems offload it:

| Platform | Renderer |
|---|---|
| Windows | Direct2D / DirectWrite (GPU) |
| macOS | Core Text / Core Graphics (GPU) |
| Linux | FreeType (CPU raster) + GPU compositing |

### Tofu (□) and Why Emoji Look Different Everywhere

- **□ (tofu):** the font has no glyph for that code point — the lookup failed
- **Emoji differ across platforms:** same code point (e.g. U+1F600), but Apple and Google drew different vector shapes for it

---

## Pseudocode for a Unicode Renderer

```
function render_text(text, font, size, x, y):
    cursor_x = x
    cursor_y = y

    for each code_point in text:

        # 1. look up the glyph in the font
        glyph = font.lookup(code_point)

        # 2. rasterize the vector curves into a bitmap
        bitmap = rasterize(glyph.bezier_curves, size)

        # 3. paint the bitmap onto the screen at current cursor position
        paint(bitmap, cursor_x, cursor_y)

        # 4. advance cursor to the right
        cursor_x += glyph.advance_width * size


function rasterize(curves, size):
    bitmap = empty_grid(width=size, height=size)

    for each row in bitmap:
        for each pixel in row:
            if pixel_is_inside_curves(pixel, curves):
                bitmap[pixel] = BLACK
            else:
                bitmap[pixel] = WHITE

    return bitmap
```

Key notes:
- `advance_width` is stored in the font — it controls how far the cursor moves after each character, which is why `i` takes less space than `m`
- Real renderers also apply **kerning** (adjusting space between specific pairs like `AV`) and **antialiasing** (blending edge pixels to smooth curves at small sizes)
- Font glyphs use quadratic bezier curves (TrueType `.ttf`) or cubic bezier curves (OpenType `.otf`)

---

## Writing a Unicode Text System in a Python Game Engine

For a Python game engine, you don't write a Unicode parser — Python handles that natively. `str` is already a Unicode string. The real work is the font rendering pipeline.

**You don't need this:**
```python
# Python strings are already Unicode — no parser needed
text = "hello あ 🎮"
for char in text:
    code_point = ord(char)   # this IS the "unicode parser"
```

**What you actually build is the renderer.** Three practical options:

### Option 1 — pygame + freetype (easiest)

```python
import pygame
import pygame.freetype

pygame.init()
screen = pygame.display.set_mode((800, 600))
font = pygame.freetype.Font("myfont.ttf", size=24)

# internally: code point → glyph lookup → rasterize → surface
font.render_to(screen, (100, 100), "hello あ", (255, 255, 255))
```

### Option 2 — freetype-py (more control)

```python
import freetype

face = freetype.Face("myfont.ttf")
face.set_char_size(24 * 64)   # size in 1/64 pixels

face.load_char("A")           # looks up glyph by character
bitmap = face.glyph.bitmap    # rasterized pixels — you control placement
```

### Option 3 — moderngl + SDF shaders (GPU rendering)

Load glyph vectors via `freetype-py`, upload as geometry to the GPU, rasterize in a fragment shader using Signed Distance Field rendering. This is what modern game engines do for crisp text at any scale.

For most game engine projects, Option 1 is the right starting point.
