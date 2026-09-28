# DrumPal — Build Spec for Claude Code

A 1-year, self-paced modern metal drumming program for an iPad, built on real YouTube lessons and motor-learning research rather than generic "practice more" advice.

Context: returning drummer, not a true beginner. Played punk for 10 years (fast, straight 4/4, strong time-feel and raw speed), then a 20-year layoff. Two specific gaps, not a general "start from zero":
1. **Stamina/endurance is rusty**, not the underlying coordination. Calluses, forearm and calf endurance, and general playing cardio need rebuilding. This is conditioning, not skill-learning, and should be tracked and trained as its own thing.
2. **Metal-specific rhythmic vocabulary is genuinely new**, not rusty. Punk doesn't use odd time, polymeter, or syncopated kick placement, so treat rhythm foundations (subdivision counting, odd groupings) as real basics to teach, not review.

Do not default to true-beginner bpm floors across the board. Where the skill is likely intact from the punk background (basic straight-time single strokes, general timing, backbeat feel), start at a moderate tempo and ramp faster than a true beginner would. Where the skill is genuinely new (polymeter, odd time, subdivision counting/reading), start at true-beginner pace regardless of overall experience level.

20-30 min/day, electronic kit (NUX DM8), one kick pedal (no double bass for now), wants a genuinely flashy modern-metal skill set, not just competence. Prefers djent/polymetric style over blast-beat-heavy extreme metal. Gets motivated by visible progress and early wins.

**Single-kick note:** this is good news, not a limitation. Djent's core identity, the Meshuggah-style polymeter, is built from a single repeating stream of kick notes cycling in an odd grouping (e.g. a 4/16 or 7/16 kick pattern) against a steady 4/4 on the hands. It's about placement precision, not double-stroke speed. A second pedal only starts to matter for the double-kick bursts some djent bands layer into fills, which is a later, optional add-on, not a blocker to sounding like djent.

---

## 1. Pedagogical rules the app must encode

These aren't decoration, they drive the data model and the UI. Don't build a generic "lesson list with checkboxes" app.

1. **Interleave, don't block.** Every practice day touches more than one skill category (hands/rudiments, feet, groove/coordination, speed, application). Do NOT structure the year as sequential locked phases where one skill dominates for months before the next starts. Emphasis shifts gradually across ~52 weeks via continuous per-skill bpm/difficulty curves, not hard phase gates.
2. **Chunk everything.** Any new pattern is introduced broken into 2-3 note chunks before being played as a whole. The content/copy for each lesson should say this explicitly, not just show a video.
3. **Deliberate practice at the edge, not gradual buildup.** The speed-training logic is: push to a tempo where it starts breaking down, drop ~10bpm, play clean, then push again. This is Derek Roddy's own stated method. Encode this as the literal instruction text on every bpm-target block, not just a bpm number.
4. **Spaced repetition, not one-and-done.** Every ~4th-5th day is a consolidation day: no new material, just review of the week's weakest link + a recorded checkpoint. Older skills should resurface briefly in later weeks even after their "spotlight" period ends, don't let them fully drop off.
5. **Small, specific goals over vague ones.** Every day's goal should be answerable "did I do this, yes/no" — not "get better at blast beats."
6. **Distributed practice is a feature, not a compromise.** The copy should never imply 20-30 min/day is a lesser version of a "real" practice routine. It's supported by the research on consolidation during rest/sleep.

## 1a. Named drill: independence-to-polymeter bridge (Dimitri Fantini)

Source: a 4-way independence ostinato the person found in a Dimitri Fantini video. Hands run a steady L-R-L-R loop, feet run K (kick) - rest - H (hi-hat foot) - K.

As described this is a **coordination/independence drill, not polymeter yet**: both cycles are 4 units long, so they realign every repeat. Still valuable, and the correct prerequisite, but distinct from the actual djent trick.

**Progression built into the app:**
1. Hands alone, feet alone, then combine slow. Standard independence-building order.
2. Once solid at a comfortable tempo, stretch the foot pattern to a different length than the hand cycle (5 units: K-rest-H-rest-K, or 3 units: K-H-K) while hands stay at 4. The foot pattern's start now lands on a different beat of the hand cycle each repeat. That drifting relationship is real polymeter, not just independence.
3. This drill should sit right before the "First Polymeter" module (end of module 1 / start of module 2), as the literal bridge between plain limb independence and the Meshuggah-style displacement Jay Postones and HackMusicTheory teach.
4. Add the hi-hat foot voice generally, it's not just pedagogically useful, it's stylistically correct for modern metal's mechanical groove texture.

## 2. Video library (real, verified — do not invent new ones without checking)

Each entry: `{id, title, teacher, url, category, notes}`. Categories: `foundation`, `feet`, `djent`, `oddtime`, `linear`, `speed`, `extra` (optional/deprioritized).

Djent/polymeter is now the spine of the program instead of blast beats. Blast-beat content is kept under `extra` as an optional side quest, not the main path.

```
foundation:
  - Single Paradiddle — Drumeo — https://www.youtube.com/watch?v=-imiZIrGwXE
  - Single Paradiddle-Diddle — Drumeo — https://www.youtube.com/watch?v=0z58p1nd4PQ

rhythmFoundations: (new — genuinely new material despite the person's playing history, punk doesn't cover this)
  - How to Count Sixteenth Notes, Animated Rhythm Lesson — Ross the Music Teacher — https://www.youtube.com/watch?v=vuk_oC5niP8 (subdivision counting: 1-e-and-a. Do this before the djent polymeter conceptual video, polymeter is unreadable without solid subdivision counting first)

feet: (single-kick placement and speed, not double-bass technique)
  - Heel-Toe Bass Drum Technique — Drumeo — https://www.youtube.com/watch?v=xHqkxHaQ-bI (works fine on one pedal, it's a single-foot speed trick)
  - Syncopated Bass Drum Workout, 60-90-100bpm — YouTube lesson — https://www.youtube.com/watch?v=vKq9xk0dUxM (single-kick placement drill, comes with a PDF)

djent: (new core category — polymeter and Meshuggah-style odd-grouping kick patterns)
  - How To Easily Explain Polyrhythm vs Polymeter (make djent beats in 3 steps) — HackMusicTheory — https://www.youtube.com/watch?v=08hmJd1BVKk (the conceptual foundation, do this first)
  - ODD TIMED DRUMMING, Drum Lesson — Jay Postones (TesseracT) — https://www.youtube.com/watch?v=w83rbm4JBo0
  - Drum Composition Hack For Odd-Timed Grooves (Meshuggah Lesson) — Jay Postones (TesseracT) — https://www.youtube.com/watch?v=xi2X3KiL7gM
  - Bleed by Meshuggah, Drum Lesson breakdown — YouTube lesson — https://www.youtube.com/watch?v=QCBr1ws2JYo (real song application, the genre's founding riff)

oddtime:
  - Go-To Odd Time Grooves — Aaron Edgar / Drumeo — https://www.youtube.com/watch?v=mvHa9mokz_I
  - Danny Carey's Tools Of The Trade — Aaron Edgar / Drumeo — https://www.youtube.com/watch?v=-Emut0-LYJE

linear:
  - How To Play Linear Singles — Alex Rudinger / Drumeo — https://www.drumeo.com/beat/how-to-play-linear-singles/ (article page, not a bare YouTube embed)
  - Alex Rüdinger — full channel — https://www.youtube.com/user/mdterps1042

speed:
  - Bass Drum Speed Secrets, Part 1 — El Estepario Siberiano / Drumeo — https://www.youtube.com/watch?v=tWJGx7YbauQ
  - New Drummers Start Here — El Estepario Siberiano — https://www.youtube.com/watch?v=YxHnzqeoER4
  - The Polyrhythm Bible: 5 Against 4 — El Estepario Siberiano — https://www.youtube.com/watch?v=95Sdpqu3Hno

extra: (optional side quest, not core — revisit if a second pedal ever gets added)
  - Introduction To Blast Beats — Drumeo — https://www.youtube.com/watch?v=kEHfAgW7EsA
  - Blast Beat Variation — George Kollias — https://www.youtube.com/watch?v=dCxvG5g5wok
  - Blast Beat Technique (Slo-Mo) — Derek Roddy / Drumeo — https://www.youtube.com/watch?v=2A8psfS7-vA
  - Odyssey of Double Bass Drumming, Lesson 1 — George Kollias — https://www.youtube.com/watch?v=bxX1UFf1Q3o (needs a second pedal)
  - Gravity Blast Technique — archived lesson — https://www.youtube.com/watch?v=TPwP03ZUJOc (weak entry, low priority now)
```

Jay Postones is the key new addition: current TesseracT drummer, one of djent's founding players, and unlike most metal pros he actively teaches (jaypostones-drumlessons.com has more free lessons worth mining later). Before building, re-verify all URLs still resolve, YouTube links rot.

## 3. Data model (continuous curves, not phase blocks)

```
Skill = { key, label, bpmStart, bpmEnd, introducedWeek, category }
```

Define skills as continuous curves across weeks 1-52 (not 4 discrete phases):
- `stamina`: weeks 1-52, tracked as continuous playing time not bpm (e.g. "groove for 2 min unbroken" -> "8 min unbroken" by week 8, then hold steady while other curves ramp). This is conditioning, rebuild it fast, punk-era stamina comes back quicker than it was built the first time, but don't skip it or week-3 forearms will revolt.
- `subdivisionCounting`: weeks 1-3 only, a short foundational module (count out loud over a click, 8th -> 16th -> the odd groupings djent needs), genuinely new material regardless of the person's playing years. Retire once `polymeter` ramps past 5/16 groupings.
- `singleStroke`: weeks 1-52, 90->150bpm (starts higher than a true beginner given 10 years of punk-speed background)
- `singleKickPlacement`: weeks 1-52, 70->150bpm
- `polymeter`: introduced week 3, after subdivision counting is solid, difficulty curve = odd-grouping complexity (4/16, then 5/16, then 7/16, then combined groupings), tempo climbs 70->140bpm in parallel
- `oddTime`: introduced week 10 (module 4), difficulty curve not bpm (track "grooves learned" count instead)
- `linearFills`: introduced week ~20, difficulty curve (number of fill variations learned)
- `blastBeat` (optional, `extra` category): only surfaces if the person opts into a side quest, not on the default track

Each day picks 3 blocks (Soundcheck / Set / Encore) by:
1. Soundcheck = always `foundation`, rotates through library, bpm = slow global control curve.
2. Set = the week's "spotlight skill" (a skill in its early-to-mid ramp) + a light-touch review rep of one older skill roughly every 3rd day (spaced repetition).
3. Encore = always application-flavored: take the day's or a recent skill and frame it as "drop it into 8 bars of music," not another isolated drill.

Every 5th day = consolidation day: no new skill introduced, weakest-of-the-week drill + a "record 15-30 seconds" prompt.

## 4. Progress tracking

This is a real deployed personal app, not a claude.ai artifact, so use a real backend, not `window.storage` or `localStorage` (those were only stand-ins for the throwaway draft).

- **Database: Cloudflare**, account ID `b5b4fd1615fc03cb75076123542787ff` (dashboard: https://dash.cloudflare.com/b5b4fd1615fc03cb75076123542787ff/home). Decide D1 (SQLite, relational, better fit if lessons/progress/bests are modeled as proper tables) vs. KV (simple key-value, closer to what the draft already does, less setup). Given the data is basically "per-lesson completion state + a handful of personal-best numbers," either works, D1 is the more standard choice if this ever grows features (multiple users, richer queries), KV is faster to ship for a single-person tool. Recommend D1 for anything meant to last, but ask before committing.
- Track: personal bests per skill key, editable bpm/stamina log per lesson, streak (consecutive lessons with all steps done), and overall + per-module completion.
- Single user, no auth needed unless the person wants to check progress from multiple devices and cares about it being properly secured, in which case a simple passphrase or Cloudflare Access is enough, don't over-build this.

## 5. Open decisions to make before building

- D1 vs. KV for the Cloudflare database (see section 4).
- Do you want video progress (did I watch it) tracked separately from drill completion?
- Should rest days be explicit in the UI (2 off days/week) or left totally open as now?
- Gravity blast category needs 2-3 stronger modern lessons, worth a fresh search pass.
- **Content depth**: the draft cycles the same ~20 videos across all 260 lessons via modulo rotation, which works structurally but will feel repetitive by month 3. Worth a real research pass per module to find enough distinct lessons that repetition feels like intentional spaced review, not "there was nothing else."

## 6. UI requirements (Coursera / LinkedIn Learning direction)

The person is a visual learner and explicitly wants an LMS feel, not a plain checklist. A working draft exists at `/mnt/user-data/outputs/drumpal.html`, built as a throwaway single-file mockup for a claude.ai chat, **it's a visual/UX reference only, not a code architecture to preserve.** It's for the person's eyes alone, not something Claude Code should treat as a spec to replicate line-for-line. Rebuild it properly: real components, real backend, real data model. Carry forward the *patterns*, not the file:

- **Sidebar course outline**: modules as collapsible accordions, each showing a mini progress bar and "X/Y done" count. Expanding a module reveals its lessons as rows with a small YouTube thumbnail (`img.youtube.com/vi/{id}/mqdefault.jpg`), title, and a checkmark when complete. Clicking a row jumps straight to that lesson.
- **Main pane is video-first**: each lesson shows its 2-3 steps (Warm-Up, Core Lesson, Apply It) stacked as cards, each with a large embedded video (not a link, unless the source can't be embedded, e.g. the Drumeo article-page link and the Rudinger channel link, those get a styled "open lesson" button instead).
- **Known bug in the draft to fix properly**: some YouTube videos return "Video player configuration error, Error 153" when embedded (the uploader disabled embedding, not a code bug). The draft's quick fix is a permanent "Watch on YouTube" link under every video regardless of whether it's expected to embed. The real fix: use the actual YouTube IFrame Player API (not a bare `<iframe src="/embed/ID">`), listen for the player's `onError` event (codes 101/150 mean embedding disallowed), and auto-swap to a thumbnail + "Watch on YouTube" state when that fires, instead of relying on the person to notice a broken player. Keep the manual fallback link too, as a safety net for whatever the API misses.
- **"Keep lessons moving" flow**: one big "Mark complete & continue" button per lesson that advances to the next lesson and scrolls the view back to the top. This is the primary interaction, it should never require going back to the sidebar to keep going.
- **Progress visible everywhere**: a top-bar ring/percentage for the whole course, a bar per module, and a checkmark per lesson. Someone should be able to tell where they stand at a glance from any screen.
- **Stamina and bpm tracking live inline** on the lesson page (not a separate settings screen), with personal bests surfaced right below the lesson content.
- **Mobile-first responsive**: sidebar collapses to a slide-in drawer under ~860px width (hamburger toggle), full sidebar+content side-by-side above that. This person uses an iPad, test both portrait and landscape.
- **Bonus/side-quest content** (the deprioritized blast beat and double bass videos) lives in a collapsed section at the bottom of the sidebar, separate from the main progress count, so it doesn't dilute the djent-focused main path but isn't hidden either.
- **This is a single-person tool.** Don't add multi-tenancy, sign-up flows, or anything built for other users, that's over-engineering for what this actually is.

## 8. Deployment and tech stack

- **Full course, not a demo**: ship all 52 weeks / 260 lessons with real generated (or ideally hand-curated per section 5's content-depth note) data, not an abbreviated preview. The 2-week walkthrough given in chat earlier was a narrative example to explain the pedagogy, not a scope limit.
- **Database**: Cloudflare, account ID `b5b4fd1615fc03cb75076123542787ff`, see section 4 for D1 vs KV.
- **Source control**: GitHub, https://github.com/fernbs. Create a new repo there (suggested name: `drumpal`, matching the local project folder).
- **Local project folder** (Windows): `C:\Users\diez fernando\OneDrive - The Boston Consulting Group, Inc\Desktop\ChatGPT & Claude\Projects\Personal\DrumPal`. Work from here.
