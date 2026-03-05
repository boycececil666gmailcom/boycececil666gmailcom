# Tutorials & Passages

This directory is the central repository for all published tutorials, articles, and technical passages.

## Structure

```
tutorials/
├── tier1/   — Tier 1 Primary Focus (Python, C#, Unity, Blender, Photoshop, Git, MCP, Stable Diffusion)
├── tier2/   — Tier 2 Building Experience (Unreal Engine, JavaScript, ROS 2, HTML, Godot)
└── tier3/   — Tier 3 Exploring (Ethereum, Raspberry Pi, STM32)
```

Each tier contains topic subfolders. Drop `.md` articles directly inside the topic subfolder.

## Article Format

**Filename convention:** `YYYY-MM-DD-brief-title.md`  
**Required:** Start every article with a `# Title` heading — the update script reads this as the display name.

## Updating the Profile README

After adding new articles, run the update script from the repo root:

```bash
python .copilot/skills/update-readme/scripts/update_readme.py
```

This scans all article files and regenerates the **Tutorials & Passages** section in `README.md` with correct links.
