"""
Split styles.css into feature-scoped CSS files.
Run from new-app/: python3 scripts/split-styles.py
"""

import re
import sys
from pathlib import Path

SRC = Path(__file__).parent.parent / "src/app/styles.css"
OUT = Path(__file__).parent.parent / "src/app"

css = SRC.read_text(encoding="utf-8")

# --- Split into top-level blocks (rules + at-rules) ---
# A "block" is a sequence of lines separated by blank lines (or an @-rule).
# We keep everything intact and just classify each block.

def classify_block(block: str) -> str:
    """Return 'builder', 'player', 'summary', 'body-map', or 'layout'."""
    # Extract selector lines (lines that look like selectors, before '{')
    selector_lines = []
    for line in block.splitlines():
        stripped = line.strip()
        # Skip lines that are clearly inside a rule body or blank
        if not stripped or stripped.startswith("{") or stripped.startswith("}"):
            continue
        # Stop collecting at opening brace content
        if stripped.startswith("//") or stripped.startswith("/*"):
            continue
        selector_lines.append(stripped)

    # Collect all selector tokens from the block
    # Find all class names referenced in the block
    selectors_text = "\n".join(selector_lines)

    # Extract class names (first word of each selector)
    classes = re.findall(r'\.([\w-]+)', selectors_text)
    if not classes:
        return "layout"

    def is_builder(c): return c.startswith("builder-")
    def is_player(c): return c.startswith("player-")
    def is_summary(c): return c.startswith("summary-")
    def is_bodymap(c): return c.startswith("body-map") or c == "silhouette-slot"

    b = sum(1 for c in classes if is_builder(c))
    p = sum(1 for c in classes if is_player(c))
    s = sum(1 for c in classes if is_summary(c))
    bm = sum(1 for c in classes if is_bodymap(c))
    total = len(classes)

    # If the only classes are from one feature group, assign to that group
    if bm > 0 and bm == total:
        return "body-map"
    if p > 0 and p == total:
        return "player"
    if s > 0 and s == total:
        return "summary"
    if b > 0 and b == total:
        return "builder"

    # Mixed: goes to layout, UNLESS it's clearly dominated by one feature
    # (e.g. @media blocks that contain multiple features go to layout)
    return "layout"


# --- Parse the CSS into blocks separated by blank lines ---
# We need to be smarter: parse by balanced braces to get real top-level rules.

def parse_blocks(text: str):
    """
    Parse CSS into a list of (block_text, category) tuples.
    A block is one or more top-level rules that are visually grouped (no blank line between them).
    """
    blocks = []
    current = []
    depth = 0
    in_comment = False

    lines = text.split("\n")
    i = 0
    while i < len(lines):
        line = lines[i]

        # Track comment depth
        if "/*" in line and "*/" not in line:
            in_comment = True
        if "*/" in line:
            in_comment = False

        current.append(line)

        # Count brace depth (outside comments)
        if not in_comment:
            depth += line.count("{") - line.count("}")

        # When we return to depth 0 and see a blank line after, flush the block
        if depth == 0 and not in_comment:
            # Look ahead for blank line
            if i + 1 >= len(lines) or lines[i + 1].strip() == "":
                blocks.append("\n".join(current))
                current = []
                # Skip the blank line
                if i + 1 < len(lines):
                    i += 1  # skip the blank separator

        i += 1

    if current:
        blocks.append("\n".join(current))

    return blocks


blocks = parse_blocks(css)

# Classify each block
classified = [(b, classify_block(b)) for b in blocks if b.strip()]

# --- Separate @media blocks: media blocks span multiple features,
#     so we split them by feature group ---
# For simplicity, we'll handle @media blocks specially.
# For each @media block, extract its inner rules and reclassify into sub-blocks per feature.

def split_media_block(media_block: str):
    """
    Given a @media { ... } block, split the inner rules by feature.
    Returns a dict: category -> list of rules inside that media block.
    """
    # Extract the @media header (e.g. "@media (max-width: 767px)")
    header_match = re.match(r'(@media[^{]+)\{', media_block, re.DOTALL)
    if not header_match:
        return {"layout": [media_block]}

    header = header_match.group(1).rstrip()

    # Extract inner content (between outer braces)
    inner_start = media_block.index("{") + 1
    inner_end = media_block.rindex("}")
    inner = media_block[inner_start:inner_end]

    # Parse inner rules
    inner_blocks = parse_blocks(inner)

    categorized: dict[str, list] = {}
    for block in inner_blocks:
        if not block.strip():
            continue
        cat = classify_block(block)
        categorized.setdefault(cat, []).append(block)

    # Wrap each category's rules back in the @media block
    result = {}
    for cat, rules in categorized.items():
        inner_text = "\n\n".join(r for r in rules if r.strip())
        result[cat] = f"{header} {{\n{inner_text}\n}}"

    return result


# Re-process: expand @media blocks into per-feature sub-blocks
final: dict[str, list[str]] = {
    "layout": [],
    "builder": [],
    "player": [],
    "summary": [],
    "body-map": [],
}

for block, cat in classified:
    stripped = block.strip()
    if not stripped:
        continue

    if stripped.startswith("@media") or stripped.startswith("@keyframes"):
        if stripped.startswith("@media"):
            sub = split_media_block(stripped)
            for sub_cat, sub_block in sub.items():
                final.setdefault(sub_cat, []).append(sub_block)
        else:
            # @keyframes: classify by the animation name / selectors inside
            final[cat].append(stripped)
    else:
        final[cat].append(stripped)


# --- Write output files ---

for feature, rules in final.items():
    if not rules:
        continue
    content = "\n\n".join(rules) + "\n"
    out_path = OUT / f"{feature}.css"
    out_path.write_text(content, encoding="utf-8")
    print(f"  Wrote {out_path.name} ({len(content.splitlines())} lines, {len(rules)} blocks)")


# --- Update styles.css to @import the feature files ---
imports = "\n".join([
    "@import './layout.css';",
    "@import './builder.css';",
    "@import './player.css';",
    "@import './summary.css';",
    "@import './body-map.css';",
]) + "\n"

SRC.write_text(imports, encoding="utf-8")
print(f"\n  Updated {SRC.name} to use @import statements")
print("\nDone.")
