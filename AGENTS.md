# DrumPal — Agent Operating Rules

## Session start

At the beginning of each session:

1. Read `README.md`.
2. Identify the workstream relevant to the user's request.
3. Read its indexed memory file before acting.
4. Check for stale facts, contradictions, or missing context.
5. Flag material issues, then continue when it's safe to.

Don't reread unrelated memory when the task doesn't need it.

## File state

- `Working/` holds current work only.
- `Source/` is read-only evidence. Don't change it without explicit approval.
- `Archive/` holds superseded material. Move things there when a replacement becomes current.
- Never leave current and superseded versions looking equally authoritative.
- Prefer archiving over deletion. Never delete without explicit user approval.

## Memory write gate

Nothing may be added to, removed from, or reworded in a `MEMORY.md` without first showing the user the exact proposed change and getting approval.

The agent may detect, draft, and recommend a memory update. It can't silently turn an inference into a stored fact.

After an approved change, update the root memory index and last-reviewed date.

## Routine maintenance

The agent may do the following without a separate prompt, when it's a direct consequence of approved work:

- Create missing internal folders or templates this system requires.
- Keep the root map and memory index aligned with actual files.
- Move a replaced working file to `Archive/` after its replacement is approved.
- Identify duplicate, stale, misplaced, or orphaned material.
- Propose memory updates through the write gate.

The agent must request approval before:

- Changing project memory.
- Deleting files or comments.
- Overwriting source material.
- Publishing, pushing, or updating an external system (including GitHub).
- Changing scope, the authority map, or these operating rules.
- Acting when two sources of truth conflict.

## External systems

- GitHub is authoritative for code and issues. The local workspace is for drafting and iteration.
- Before relying on or updating external information, check the source-of-truth table in `README.md`.
- Never push the whole workspace. Scope every push to the specific approved item.
- Keep private drafts, memory, and scratch material out of the GitHub repo unless explicitly approved.

## Audit

Run only when the user asks. Read `README.md` and all indexed memory files together.

Check for: contradictory facts, stale project facts, ignored rules, uncaptured decisions, orphaned memory files, files in wrong folders, duplicate versions, superseded content still influencing current work, broken references, and unnecessary structure.

Report findings in three groups: safe housekeeping, proposed memory changes, decisions needed from the user.

Apply safe housekeeping directly. Route memory changes through the write gate. Don't resolve conflicting truths by guessing.
