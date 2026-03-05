#!/usr/bin/env python3
"""
publish_tutorial.py
===================
Creates a new tutorial markdown file in the correct tier/topic folder
and runs update_readme.py to refresh README.md.

Usage:
    # Exact content inline
    python publish_tutorial.py --title "My Title" --tier tier1 --topic python --content "# My Title\n\nBody here."

    # Exact content from a file
    python publish_tutorial.py --title "My Title" --tier tier1 --topic python --content-file path/to/draft.md
"""

import argparse
import re
import subprocess
import sys
from datetime import date
from pathlib import Path

# ---------------------------------------------------------------------------
# Paths  (.copilot/skills/publish-tutorial/scripts/publish_tutorial.py)
# ---------------------------------------------------------------------------
REPO_ROOT = Path(__file__).resolve().parent.parent.parent.parent.parent
TUTORIALS_ROOT = REPO_ROOT / "tutorials"
UPDATE_SCRIPT = (
    REPO_ROOT / ".copilot" / "skills" / "update-readme" / "scripts" / "update_readme.py"
)

VALID_TIERS = ("tier1", "tier2", "tier3")


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def slugify(title: str) -> str:
    slug = title.lower()
    slug = re.sub(r"[^\w\s-]", "", slug)
    slug = re.sub(r"[\s_]+", "-", slug)
    return re.sub(r"-+", "-", slug).strip("-")


def ensure_title_heading(content: str, title: str) -> str:
    """Prepend '# Title' if the content doesn't already start with one."""
    if not content.lstrip().startswith("# "):
        return f"# {title}\n\n{content}"
    return content


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
def main() -> None:
    parser = argparse.ArgumentParser(
        description="Publish a tutorial article and refresh README.md."
    )
    parser.add_argument("--title", required=True, help="Article display title")
    parser.add_argument(
        "--tier", required=True, choices=VALID_TIERS, help="tier1 / tier2 / tier3"
    )
    parser.add_argument("--topic", required=True, help="Topic folder name, e.g. python")
    parser.add_argument(
        "--date",
        default=str(date.today()),
        help="Publication date YYYY-MM-DD (default: today)",
    )

    content_group = parser.add_mutually_exclusive_group(required=True)
    content_group.add_argument(
        "--content", help="Full markdown content as a string"
    )
    content_group.add_argument(
        "--content-file", help="Path to a .md file containing the article content"
    )

    args = parser.parse_args()

    # Resolve content
    if args.content:
        content = args.content.replace("\\n", "\n")
    else:
        src = Path(args.content_file)
        if not src.exists():
            print(f"ERROR: content file not found: {src}", file=sys.stderr)
            sys.exit(1)
        content = src.read_text(encoding="utf-8")

    content = ensure_title_heading(content, args.title)

    # Build target path
    slug = slugify(args.title)
    filename = f"{args.date}-{slug}.md"
    target_dir = TUTORIALS_ROOT / args.tier / args.topic
    target_dir.mkdir(parents=True, exist_ok=True)
    target_path = target_dir / filename

    if target_path.exists():
        print(f"ERROR: file already exists: {target_path.relative_to(REPO_ROOT)}", file=sys.stderr)
        sys.exit(1)

    target_path.write_text(content, encoding="utf-8")
    print(f"Created: {target_path.relative_to(REPO_ROOT)}")

    # Run update_readme.py
    if not UPDATE_SCRIPT.exists():
        print(f"WARNING: update_readme.py not found at {UPDATE_SCRIPT}", file=sys.stderr)
        sys.exit(0)

    result = subprocess.run(
        [sys.executable, str(UPDATE_SCRIPT)],
        capture_output=True,
        text=True,
    )
    print(result.stdout, end="")
    if result.stderr:
        print(result.stderr, end="", file=sys.stderr)
    sys.exit(result.returncode)


if __name__ == "__main__":
    main()
