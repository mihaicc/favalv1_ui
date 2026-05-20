---
name: update-features
description: >
  Update FEATURES.md at /home/mihaicc/faval/FEATURES.md whenever a UI change is made to the
  favalv1_ui project — new pages, new components, changed behaviour, removed features, new
  API endpoints consumed, or new limitations discovered. Trigger this skill automatically after
  completing any task that adds, modifies, or removes a user-facing feature, route, or API
  integration. Also trigger when the user asks to "update the feature docs", "update FEATURES.md",
  or "document this feature".
---

# Update Features

FEATURES.md lives at `/home/mihaicc/faval/FEATURES.md` and is the single source of truth for
what the app does, how each feature works, and what its current limitations are.

## When to run this skill

Run this skill **at the end of any task** that:
- Adds a new page or route
- Adds or removes a nav link
- Changes how an existing feature works
- Adds, changes, or removes an API endpoint the frontend consumes
- Discovers a new limitation (e.g. no auth, no pagination, manual DB setup required)
- Removes a feature entirely

Do NOT run this skill for pure styling changes, copy edits, or refactors that don't alter behaviour.

## How to update FEATURES.md

1. **Read the current file** at `/home/mihaicc/faval/FEATURES.md`
2. **Identify what changed** from the task you just completed — new section, updated section, or
   removed section
3. **Edit the file** with the minimal necessary changes:
   - Add a new `##` section for a new feature, following the existing format
   - Update the relevant section(s) for changed behaviour or new limitations
   - Remove a section if the feature was deleted
   - Keep every section to: what it does, how it works, limitations

## Section format

Each feature section must follow this structure — keep it tight, factual, no fluff:

```markdown
## Feature Name

**What it does:** One sentence.

**How it works:** Implementation detail — which component, which API call, key logic.

**Limitations:**
- Bullet list of known gaps, missing auth, manual steps, unimplemented items
```

If the feature has sub-sections (e.g. an API with multiple endpoints, or a component with
distinct parts), use a nested list or a small table — see the Author Feeds API section as an example.

## What NOT to change

- Do not rewrite sections that weren't touched by the task
- Do not add aspirational features or future plans — only what exists and works right now
- Do not describe the code structure in detail — describe behaviour and integration points
