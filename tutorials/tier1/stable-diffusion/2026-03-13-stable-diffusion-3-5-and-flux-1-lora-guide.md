# Stable Diffusion 3.5 and FLUX.1 LoRA Guide

This tutorial provides a comprehensive overview of the latest Diffusion-based AI models, specifically Stable Diffusion 3.5 and FLUX.1, and the role of LoRAs in the creative workflow.

## 1. Stable Diffusion 3.5 Variants

Developed by Stability AI, SD 3.5 uses the Multimodal Diffusion Transformer (MMDiT) architecture and comes in three main versions:

| Variant | Parameters | VRAM Required | Best For |
|---------|------------|---------------|----------|
| **Large** | 8.1B | 16GB+ | Highest quality, complex prompts. |
| **Medium** | 2.6B | 8GB+ | Balance of quality and speed. Realistic for consumer GPUs. |
| **Large Turbo** | 8.1B | 16GB+ | Extreme speed (4-8 steps) via distillation. Fast prototyping. |

## 2. SD 3.5 vs. FLUX.1

Choosing between these models depends on your specific goals:

- **FLUX.1 [dev]**: Superior for photorealistic humans, architecture, and fine details. (Non-commercial license).
- **FLUX.1 [schnell]**: Extremely fast and licensed under Apache 2.0 (Commercial use allowed).
- **SD 3.5 Large Turbo**: Better for anime/illustration styles and offers more control via negative prompts.

## 3. The Role of LoRA and Model Ecosystem

In the hierarchy of AI components, **LoRA (Low-Rank Adaptation)** is the most critical for individual developers due to its lightweight nature (MBs vs GBs) and versatility.

- **LoRA**: Used to fix specific characters, styles, or subjects. Multiple LoRAs can be stacked.
- **Checkpoint**: The essential foundation (the base model).
- **ControlNet**: Advanced tools for fixing poses and composition.
- **VAE**: Handles color correction and sharpness.

## 4. Where to Find LoRAs

- **CivitAI**: The primary platform for LoRAs. It features a user-friendly UI, sample images, and categorized filtering.
- **HuggingFace**: More research-oriented and technical, hosting official model weights and professional repositories.

Stable Diffusion 3.5 Large LoRAs are generally compatible with the Turbo version but not the Medium version.
