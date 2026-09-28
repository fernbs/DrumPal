# DrumPal — Master Production Plan

This file is the north star for every session. No matter what specific task is in progress, every session starts by reading this file and ends by updating the Current Position marker. If this plan and a session's task ever conflict, this plan wins unless Fernando explicitly changes it here first.

---

## Decisions locked

| Decision | Choice | Locked |
|---|---|---|
| Database | Cloudflare D1 (SQLite, relational) | Yes |
| API layer | Cloudflare Workers + Hono | Yes |
| Frontend | React + Vite (SPA) | Yes |
| Hosting | Cloudflare Pages | Yes |
| Source control | GitHub — https://github.com/fernbs/DrumPal | Yes |
| Auth | None (single-user tool). Revisit if multi-device privacy matters. | Yes |
| Video tracking | Separate from drill completion (two states per lesson step) | Yes |
| Rest days | Not scheduled. Open calendar, practice when ready. | Yes |
| Blast beats | Optional side quest in a collapsed sidebar section. Not on main path. | Yes |
| Double bass | Out of scope. Revisit if a second pedal is added. | Yes |
| Content depth | Algorithmically generated schedule, instruction text varies by skill-curve position. Not a flat modulo rotation. | Yes |

---

## Current position

```
Phase: 0 — Foundation
Status: In progress
Last updated: 2026-09-28
```

Update this block at the end of every session.

---

## Phase 0 — Foundation

**Goal:** Working local project, schema defined, lesson generator algorithm designed, repo on GitHub.

**Deliverables:**
- [ ] Local project folder structure (`src/`, `worker/`, `db/`) initialised with Vite + React + Hono
- [ ] `package.json` with all dependencies
- [ ] D1 schema file (`db/schema.sql`) with all tables
- [ ] Skill-curve definitions file (`src/data/skills.js`) covering all 7 skill tracks
- [ ] Lesson generator (`scripts/generateLessons.js`) producing 260 lesson objects with varied instruction text
- [ ] `lessons.json` (generated output, seeded into D1 on deploy)
- [ ] GitHub repo initialised, initial commit pushed
- [ ] `wrangler.toml` configured (D1 binding, account ID, project name)

**Done when:** `npm run dev` runs locally, the lesson data file generates cleanly, and the repo is on GitHub with no sensitive credentials committed.

**Session estimate:** 1-2 sessions.

---

## Phase 1 — Workers API

**Goal:** A deployed Cloudflare Worker that serves lesson data and reads/writes progress to D1.

**Endpoints to build:**
- `GET /lessons` — all lessons (or paginated by week/module)
- `GET /lessons/:id` — single lesson with steps
- `POST /progress` — mark a step as watched or drilled (body: `{ lessonId, stepId, type: 'watch'|'drill', done: bool }`)
- `GET /progress` — all completion states for this user
- `POST /bests` — log a personal best (`{ skillKey, value, unit }`)
- `GET /bests` — all personal bests
- `GET /streak` — current streak (computed from progress table)

**Done when:** All endpoints return correct data from D1, tested with `wrangler dev` locally, and deployed to a Cloudflare Worker URL.

**Session estimate:** 1 session.

---

## Phase 2 — Frontend shell

**Goal:** The full app skeleton renders in a browser with real data from the Worker, no placeholder content.

**Deliverables:**
- [ ] App layout: sidebar + main pane, side-by-side above 860px, stacked below
- [ ] Sidebar: module list as collapsible accordions, each with mini progress bar and "X/Y done" count
- [ ] Sidebar lesson rows: YouTube thumbnail, title, checkmark when complete
- [ ] Sidebar bottom section: collapsed "Side quests" block for blast beat and double bass content
- [ ] Top bar: course-wide progress ring + percentage
- [ ] Routing: clicking a lesson row loads it in the main pane
- [ ] Hamburger toggle on narrow screens (iPad portrait)
- [ ] Lesson pane shell: title, module, week, 3 step cards (Warm-Up / Core / Apply It) — no video yet

**Done when:** App loads, sidebar shows all 52 weeks / 260 lessons pulled from the Worker, clicking a lesson shows the correct lesson in the main pane, layout works on iPad in portrait and landscape.

**Session estimate:** 1-2 sessions.

---

## Phase 3 — Video player

**Goal:** Every lesson step shows a correctly embedded video, with a proper fallback when embedding is blocked.

**Rules:**
- Use the YouTube IFrame Player API, not a bare `<iframe src="/embed/ID">`.
- Listen for `onError` events. Codes 101 and 150 mean the uploader blocked embedding. On these codes, auto-swap to a thumbnail + "Watch on YouTube" link.
- Keep a manual "Watch on YouTube" link on every YouTube step as a safety net below the player.
- Non-embeddable sources (Drumeo article page, Alex Rudinger channel link) get a styled "Open lesson" button instead of a player.

**Done when:** All 260 lessons load their videos, no broken player states are visible, the auto-fallback fires correctly for videos where embedding is disabled (test with at least one known disallowed video).

**Session estimate:** 1 session.

---

## Phase 4 — Progress tracking UI

**Goal:** All progress is visible inline, persistent via D1, and feels live.

**Deliverables:**
- [ ] Step cards each have two completion controls: "Watched" toggle and "Drilled" toggle (separate, as decided)
- [ ] "Mark complete and continue" button advances to next lesson and scrolls to top
- [ ] Inline BPM/stamina logger on lesson page (editable field, saves to D1 on blur or submit)
- [ ] Personal bests displayed below the lesson content (the current best for that skill key, updated when a new value is logged)
- [ ] Streak counter in top bar (consecutive days with at least one lesson fully drilled)
- [ ] Sidebar checkmarks and progress bars update in real time as steps are completed
- [ ] Consolidation day UI: days 5, 10, 15... show a different lesson template — no new skill, "record 15-30 seconds" prompt, review of weakest drill from the week

**Done when:** Completing a step persists across a hard refresh, the streak increments correctly, and personal bests update when a higher value is entered.

**Session estimate:** 1 session.

---

## Phase 5 — Deployment

**Goal:** The app is live at a real Cloudflare Pages URL, served from the `main` branch.

**Deliverables:**
- [ ] Cloudflare Pages project connected to `github.com/fernbs/DrumPal`
- [ ] D1 production database created, schema migrated, lessons seeded
- [ ] Workers deployed and bound to Pages via `wrangler.toml`
- [ ] Environment variables set (no credentials in the repo)
- [ ] CI/CD: pushing to `main` triggers a Pages build and deploy automatically
- [ ] App accessible from iPad browser at the Pages URL

**Done when:** The app loads cleanly at the Pages URL, progress persists in D1, and a push to `main` successfully auto-deploys.

**Session estimate:** 1 session (can be blocked by Cloudflare config; budget extra time).

---

## Phase 6 — QA and polish

**Goal:** The app works correctly on an iPad in both orientations, all 260 lessons are content-checked, and nothing is broken or misleading.

**Checklist:**
- [ ] iPad portrait and landscape: layout, sidebar drawer, video embed, step cards
- [ ] All YouTube URLs verified as still live (links rot — run a check script)
- [ ] Instruction text review: week 1 and week 52 lessons read convincingly different for the same skill
- [ ] Consolidation days (every 5th lesson) confirmed to show the right template
- [ ] Side-quest section is collapsed by default, doesn't affect main progress count
- [ ] "Mark complete and continue" never gets stuck (last lesson of a module goes to next module correctly)
- [ ] Streak counter edge cases: what happens if a day is skipped, what happens at midnight

**Session estimate:** 1 session.

---

## Post-launch iterations (not blocking)

These don't block the launch. Do them after Phase 6 is complete.

| Item | Notes |
|---|---|
| Content depth research | Find additional videos per module so rotation feels like review, not repetition. Priority: djent and oddTime modules. |
| Jay Postones lessons | Mine jaypostones-drumlessons.com for free lessons to expand the djent module. |
| Gravity blast | Find 2-3 stronger modern lessons to replace the weak current entries if the side quest ever gets used. |
| Cloudflare Access | Add a passphrase gate if multi-device access starts to feel exposed. |
| Double bass | If a second pedal is added, unlock the double-bass content and add a new skill track. |

---

## Rules for every session

1. Read this file at the start of the session.
2. Read `SPEC.md` if the task touches data model, lesson content, or UI patterns.
3. Read `Working/DrumPal/MEMORY.md` for current project facts.
4. Work through the current phase's deliverables in order. Don't skip ahead to a later phase to make progress feel faster.
5. Update the Current Position block at the end of the session.
6. Proposed MEMORY.md changes go through the write gate — show Fernando the exact text first.
7. Nothing goes to GitHub or Cloudflare without explicit approval per push.
8. If this plan needs to change, change it here first, then act. Don't drift from it silently.
