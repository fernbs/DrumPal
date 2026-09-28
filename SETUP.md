# Set up and operate this project

## Instruction to the agent

Read this file completely, then carry out the setup rather than only explaining it.

Use the existing workspace as evidence.

Preserve anything already there, avoid duplicate systems, and never delete or overwrite material just to make it fit this structure.

Ask only for project-specific decisions that you cannot safely infer.

Once those decisions are answered, create the structure, verify it, and begin operating under the resulting rules.

This is a practical starting point, not a mandatory folder system.

Keep it as simple as the work allows and adapt it when the project genuinely needs something different.

## Intended result

Set up a workspace that:

- Separates current work, source material, and superseded material.
- Uses a root `README.md` as the project map and operating guide.
- Keeps concise, typed memory for each active project or workstream.
- Gives Codex and Claude Code the same standing instructions.
- Reviews relevant context at the start of a session.
- Requires approval before anything is written into project memory.
- Records which local or external system is authoritative for each kind of information.
- Audits the workspace at sprint boundaries or another agreed cadence.
- Prevents stale files, contradictory facts, duplicate versions, orphaned notes, and accumulated AI-generated clutter from silently influencing current work.

## First-run process

### 1. Inspect before changing anything

Read the current directory, existing instruction files, documentation, specifications, memory files, and version-control state.

Search for structures that already serve the purpose described here before creating new ones.

If equivalent files exist, extend them carefully rather than creating competing versions.

Do not move, rename, replace, or delete existing material during discovery.

### 2. Establish the scope

Infer what you can from the workspace, then ask the user one concise batch of questions covering only what remains unknown:

1. What is the project or workspace called?
2. Is this a short task, a project, a programme with several projects, or an ongoing area of work?
3. What outcome is the work meant to produce?
4. Which projects or workstreams are currently active?
5. What personal guardrails, tone rules, or scope boundaries must always apply?
6. Which external systems hold authoritative information, and what does each one own?
7. When should a full audit run, for example at the start or end of each sprint, every few weeks, or both?

Do not ask for information that is already clear from existing files.

If the work is genuinely small, use the minimum viable version of this system rather than adding empty layers.

### 3. Create the base structure

Unless the existing workspace or the user's answers require a justified variation, create:

```text
project-root/
├── README.md
├── AGENTS.md
├── CLAUDE.md
├── SETUP.md
├── Working/
│   └── <Project or workstream>/
│       └── MEMORY.md
├── Source/
└── Archive/
```

Use these meanings:

- `Working/` contains current work only.
- `Source/` contains raw evidence such as briefs, transcripts, decks, emails, datasets, and supplied reference material.
- `Archive/` contains superseded material that should no longer guide current work.

Additional top-level folders are allowed when the work genuinely needs them.

If the structure changes, document the reason and the meaning of each added folder in `README.md`.

Do not create numbered project folders unless the user asks for them.

### 4. Create one shared instruction source

Create or update `AGENTS.md` as the concise, authoritative set of operating rules for coding agents in this workspace.

Create `CLAUDE.md` with this import so Claude Code uses the same rules:

```markdown
@AGENTS.md
```

If either file already contains useful project instructions, preserve them and merge carefully.

Do not maintain duplicated copies of the same rules in both files.

Keep `AGENTS.md` short enough to be read reliably at the start of every session.

Put project detail in `README.md` and project-specific context in the relevant `MEMORY.md`, then link to those files from the instructions.

## Required contents of README.md

Build the root guide with these sections.

### Purpose and scope

Record:

- The name of the workspace.
- Its current classification as a task, project, programme, or ongoing area.
- The outcome it is meant to produce.
- What is in scope and explicitly out of scope.

### Folder map

Explain the purpose of every top-level folder and any important subfolders.

State that `Source/` is read-only unless the user explicitly authorises a change.

State that superseded material moves to `Archive/` as soon as its replacement becomes current.

### Active work and memory index

Maintain a table with these columns:

| Project or workstream | Status | Working folder | Memory file | Last reviewed |
|---|---|---|---|---|

Every memory file must appear in this index.

No memory file may be left orphaned or discoverable only by chance.

### Objectives and guardrails

Record the standing intent for the whole workspace, including:

- The overall objectives.
- Scope boundaries.
- Tone or communication expectations.
- Actions the agent must never take without approval.
- Any personal working preferences that apply across every project.

### External sources of truth

Maintain a table with these columns:

| Information type | Authoritative system or location | What belongs there | How it is updated | Approval required |
|---|---|---|---|---|

Possible systems include GitHub, CaseOS, shared drives, collaboration tools, source databases, or another team-owned platform.

Do not assume that a local copy replaces the authoritative external record.

CaseOS, when used, is the structured shared layer for people, meetings, decisions, risks, and tasks that need to be found, connected, and queried by the wider team.

The local workspace is where thinking, drafting, and iteration happen.

Confirmed information is promoted to CaseOS when it becomes useful to the wider team and the user approves the update.

### Review and audit cadence

Record when the full workspace audit should run.

Use sprint boundaries when the project works in sprints.

For continuous work, use the cadence agreed with the user.

## Required contents of each MEMORY.md

Create one memory file for each active project or workstream.

Use the following structure:

```markdown
# <Project or workstream> memory

## Project facts

<!-- Current facts that may become stale. Include a last-verified date and source where possible. -->

## Working preferences

<!-- Stable preferences that apply to this workstream. -->

## Corrections

<!-- Explicit corrections that should survive into future sessions. -->

## References

<!-- Pointers to authoritative files, systems, records, or data. -->
```

Keep memory concise and factual.

Do not use it as a diary, transcript, activity log, task list, or dumping ground for everything seen during a session.

Project facts should say when they were last verified and where they came from whenever that information is available.

If a distinct concern needs its own memory file, create one and link it from both the main project memory and the root index.

## Rules to place in AGENTS.md

Create a concise version of the rules below, adapted to the project without weakening their meaning.

### Session start

At the beginning of each session:

1. Read the root `README.md`.
2. Identify the project or workstream relevant to the user's request.
3. Read its indexed memory file before acting.
4. Check that the relevant information is current, internally consistent, and sufficient for the task.
5. Flag only material contradictions, stale facts, missing context, or structural drift, then continue when it is safe to do so.

Do not reread unrelated project memory when the task does not need it.

### File state

- Keep current work in `Working/`.
- Treat `Source/` as read-only evidence unless the user explicitly approves a change.
- Move superseded material to `Archive/` when its replacement becomes current.
- Never leave current and superseded versions looking equally authoritative.
- Prefer archiving over deletion.
- Never delete material without explicit user approval.
- Preserve provenance when moving or transforming source information.

### Memory write gate

Nothing may be added to, removed from, or reworded in a `MEMORY.md` without first showing the user the exact proposed change and receiving approval.

The agent may detect a needed update, draft it, choose the correct type, and recommend where it belongs.

It may not silently turn an inference into a stored fact or preference.

After an approved change, update the root memory index and last-reviewed date when relevant.

### Routine maintenance

The agent may do the following without a separate prompt when it is a direct consequence of approved work:

- Create missing internal folders or templates required by this system.
- Keep the root map and memory index aligned with the files that exist.
- Move a replaced working file to `Archive/` after its replacement is approved.
- Identify duplicate, stale, misplaced, or orphaned material.
- Propose memory updates through the write gate.
- Run the session review and scheduled audits.

The agent must request approval before:

- Changing project memory.
- Deleting files or comments.
- Overwriting source material.
- Publishing, deploying, pushing, sharing, or updating an external system.
- Changing the agreed scope, authority map, or operating rules.
- Acting when two sources of truth conflict and precedence is unclear.

### External systems

- Use the source-of-truth table before relying on or updating external information.
- Treat local copies as working material unless the table says otherwise.
- Scope every publish or push to the specific approved item.
- Never publish the whole workspace by default.
- Keep private drafts, memory, and scratch material out of shared or deployable destinations unless explicitly approved.

### Audit

At each agreed sprint boundary or review date, read the root guide and every indexed memory file together.

Check for:

- Contradictory facts or instructions.
- Project facts that are stale or have no clear source.
- Rules that are being ignored.
- Decisions or corrections that should have been captured.
- Memory files missing from the root index.
- Files in the wrong state folder.
- Duplicate current versions.
- Superseded content still influencing active work.
- Broken references or unclear external ownership.
- Unnecessary structure or accumulated AI-generated clutter.

Report the findings in three groups: safe housekeeping, proposed memory changes, and decisions needed from the user.

Apply safe, reversible housekeeping directly when it does not change meaning.

Route every memory change through the write gate.

Do not resolve conflicting truths by guessing.

## Initial memory approval

During first setup, create the empty memory templates and draft the proposed initial entries from the user's answers and existing evidence.

Show those entries to the user exactly as they would be written.

Write them only after approval.

Do not delay creation of the rest of the safe folder and instruction structure while memory approval is pending.

## Completion checks

Before declaring setup complete:

1. Read every file you created or changed.
2. Confirm the three base folders exist, or document the approved alternative.
3. Confirm `README.md` contains the folder map, memory index, guardrails, external source-of-truth table, and audit cadence.
4. Confirm every active project has an indexed memory file.
5. Confirm `AGENTS.md` contains the standing operating rules.
6. Confirm `CLAUDE.md` imports `AGENTS.md` rather than duplicating it.
7. Check that no source material was altered and no existing content was lost.
8. Show the user the resulting directory tree, assumptions made, pending memory approval, and any unresolved decisions.

Once these checks pass, begin using the system for the user's next request.

## Kickoff message

If the user has pointed you to this file without any other instruction, treat the following as their request:

> Read `SETUP.md` completely and carry out the setup in this workspace. Use existing files as evidence, preserve anything already here, ask me only for project-specific decisions you cannot infer, then create and verify the structure. After setup, operate under the resulting rules.
