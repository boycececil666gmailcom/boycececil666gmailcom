# LLM Quantization, Model Size & GGUF Explained

This guide covers the essentials of LLM quantization: what it is, how model size is calculated, and how GGUF enables running large models on consumer hardware.

## What is Quantization?

Training a large language model produces weights in high-precision formats. A 7B model in FP32 (full 32-bit float) needs **28 GB** — impractical for most users. Quantization compresses these weights to lower precision, trading a small accuracy loss for massive size and speed gains.

```
Original FP32 weight:  0.847235901
        ↓ quantize
Quantized INT8 weight: 127            (stored as 1 byte, not 4)
        ↓ dequantize
Recovered FP32:      ~0.846
```

The model learns to work around the tiny error. Results are nearly indistinguishable from the original.

## Quantization Methods

| Format | Bytes/Param | 7B Model | Quality |
|--------|-------------|----------|---------|
| FP32 | 4 | ~28 GB | 100% |
| BF16/FP16 | 2 | ~14 GB | 100% |
| INT8 | 1 | ~7 GB | 95-99% |
| Q4_K_M (GGUF) | 0.5 | ~3.5 GB | ~92% |
| Q2_K (GGUF) | 0.3 | ~2.1 GB | ~85% |

**INT8** (8-bit) is the most popular for inference — it halves memory usage with almost no quality loss.

**INT4** (4-bit) maximizes compression, enabling huge models on consumer GPUs like the RTX 3060.

## Model Size Formula

```
Memory (bytes) = Parameters × Bytes per parameter
```

Per billion parameters:

| Precision | Memory per 1B |
|-----------|---------------|
| BF16/FP16 | ~2 GB |
| INT8 | ~1 GB |
| Q4_K_M | ~0.5 GB |

Real examples:

```
7B  in BF16:   7  × 2  = ~14 GB
7B  in INT8:   7  × 1  = ~7 GB
7B  in Q4_K_M: 7  × 0.5 = ~3.5 GB
13B in Q4_K_M: 13 × 0.5 = ~6.5 GB
72B in Q4_K_M: 72 × 0.5 = ~36 GB
```

## GGUF Format

**GGUF** (GPT-Generated Unified Format) is a file format by **llama.cpp** for storing and running quantized LLMs efficiently. Unlike safetensors (which are just raw weights), GGUF bundles everything into one file:

- Model weights (quantized)
- Vocabulary and tokenizer
- Metadata and config
- Special tokens (EOS/BOS IDs)

This makes GGUF files self-contained — you just load the file and run. No extra config files needed.

## GGUF Quantization Types

The naming pattern tells you the precision:

```
Q4_K_M
││ │  └── M = Medium (balanced quality/size)
││ └──── K = Uses better k-quants algorithms
│└─────── 4 = 4-bit quantization
└───────── Q = Quantized
```

| Type | Size (7B) | Best For |
|------|-----------|---------|
| Q8_0 | ~6.1 GB | High quality |
| Q6_K | ~5.0 GB | Good fallback |
| **Q5_K_M** | **~4.3 GB** | **Great balance** |
| **Q4_K_M** | **~3.5 GB** | **Recommended choice** |
| Q3_K_M | ~2.8 GB | Low VRAM (4GB GPU) |
| Q2_K | ~2.1 GB | Extreme compression |

**Q4_K_M** is the most popular choice — it uses k-quants to keep important weights at higher precision while compressing less critical ones aggressively. Result: 92% quality at 50% size.

## Complete Memory Formula

Running an LLM also needs memory for the KV cache and activations:

```
VRAM = Model weights + KV cache + activations
```

For Qwen2.5-7B Q4_K_M at 4096 context:

```
Model weights:    7B × 0.5 = 3.5 GB
KV cache:                     ~0.2 GB
Activations:                 ~0.5 GB
────────────────────────────────────
TOTAL:                       ~4.2 GB  (runs on RTX 3060!)
```

Same model in BF16 at 4096 context:

```
Model weights:    7B × 2   = 14 GB
KV cache:                     ~0.2 GB
Activations:                 ~0.5 GB
────────────────────────────────────
TOTAL:                       ~15 GB  (needs RTX 4090 / A100)
```

## TL;DR Quick Reference

- Quantization = compressing model weights to lower precision
- INT8 halves memory with negligible quality loss
- INT4/Q4_K_M quarter the memory with ~8% quality loss
- GGUF bundles everything into one inference-ready file
- Q4_K_M is the sweet spot: runs 7B models on 6GB GPUs
