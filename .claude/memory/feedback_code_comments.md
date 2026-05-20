---
name: code-comments-non-obvious
description: Document non-obvious logic changes with comments
metadata:
  type: feedback
---

Always document non-obvious logic changes with comments.

**Why:** Non-obvious logic decisions or workarounds are harder for future readers to understand without context.

**How to apply:** When writing logic that isn't immediately clear from reading the code, add a brief comment explaining the WHY. Examples: workarounds for specific bugs, hidden constraints, subtle invariants, or surprising behavior.
