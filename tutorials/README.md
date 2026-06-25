# Tutorials & Passages

This directory is the central repository for all published tutorials, articles, and technical passages.

## Structure

```
tutorials/
├── tier1/   — Foundations & Core Concepts (Python, C#, Unity, Blender, Photoshop, Git, MCP, Stable Diffusion, Business)
├── tier2/   — Intermediate & Applied Skills (Docker, Godot, JavaScript, ROS 2, HTML, Unreal Engine)
└── tier3/   — Advanced & Specialized (Ethereum, Raspberry Pi, STM32)
```

Each tier contains topic subfolders. Drop `.md` articles directly inside the topic subfolder.

## Article Format

**Filename convention:** `YYYY-MM-DD-brief-title.md`  
**Required:** Start every article with a `# Title` heading — the update script reads this as the display name.

## Updating the Profile README

To keep the local checkout and GitHub in sync, pull first, regenerate the README, then push the update back to the remote:

```bash
git pull origin master
python .copilot/skills/update-readme/scripts/update_readme.py
git add README.md
git commit -m "Update Tutorials & Passages README"
git push origin master
```

This scans all article files in the synced checkout and regenerates the **Tutorials & Passages** section in `README.md` with correct links.
