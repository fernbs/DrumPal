// Rich instructional content for each step, derived from step + lesson context.
// No DB storage needed — content is fully deterministic from the step's fields.

const VIDEO_NOTES = {
  singleParadiddle:
    "Drumeo's production means the stick trajectory is visible from multiple angles. The slow-motion close-ups show the exact wrist height and rebound point that makes the sticking lock in — something you can't hear from audio alone.",
  singleParadiddleDiddle:
    "The diddle extension is subtle enough that most people learn it wrong from notation alone. The Drumeo slow-motion close-ups make the accent placement visible and clarify where the extra stroke sits in the hand cycle.",
  subdivisionCounting:
    "What makes this video essential is the animated grid. Most counting tutorials describe the concept verbally. This one makes the 1-e-and-a grid physically visible — you can map your hands onto it before you try to play it.",
  heelToe:
    "Most heel-toe tutorials assume a double pedal. This Drumeo version teaches the technique on a single pedal and treats it as a single-foot speed tool, which is exactly what you need here. The camera angle captures the foot movement that's invisible from the front.",
  syncKickWorkout:
    "The three-tempo structure — 60, 90, 100 BPM — is unusual and exactly right for placement work. You learn the pattern at beginner speed, then test it at two increasingly demanding marks in the same session. The PDF included with the video is worth printing.",
  polyrhythmVsPolymeter:
    "This is the clearest explanation of the polymeter-polyrhythm distinction on YouTube. The clock animation makes the 'two loops that rarely align' model physically obvious rather than abstract. Most djent tutorials skip this foundation and jump straight to patterns — which leaves players confused about why the feel shifts.",
  jayPostonesOddTime:
    "Jay Postones is the current TesseracT drummer and one of djent's founding players. Getting the odd-timing technique from someone who performs it live in the genre means the vocabulary and phrasing are genre-correct, not approximated by a general teaching drummer.",
  jayPostonesMeshuggah:
    "This goes deeper than the odd-timing video into the compositional logic behind Meshuggah's kick patterns. Understanding why the patterns are constructed the way they are makes them easier to learn and harder to forget than pure transcription would.",
  bleedMeshuggah:
    "Bleed is the genre's founding riff and the hardest widely-known single-kick pattern in metal. This breakdown makes it approachable by slowing the notation and isolating each voice. Even if you never play it at full tempo, studying it teaches you how djent kick patterns are built.",
  oddTimeGrooves:
    "Aaron Edgar specialises in odd time and teaches it without the abstraction that most math-rock tutorials get lost in. These are usable grooves, not theory exercises. The focus is feel and application, not notation analysis.",
  dannyCarey:
    "Danny Carey's odd-time vocabulary is the most influential in modern progressive metal. This Aaron Edgar breakdown decodes the patterns without you having to transcribe them yourself — saving months of guesswork.",
  linearSingles:
    "Alex Rudinger is one of the cleanest modern players for linear technique. This Drumeo article includes notation you can print and mark up, which makes the sticking patterns easier to memorise than video alone.",
  rudingerChannel:
    "Rudinger's channel has technique breakdowns not published elsewhere — useful in the later linear fill modules once the catalogued lessons have been worked through.",
  bassDrumSpeed:
    "El Estepario is one of the fastest single-bass drummers working today and is meticulous about technique. This video focuses on physical mechanics, not just 'practise more'. There is a specific technique for building speed correctly, and skipping it means hitting a ceiling early.",
  esteparioStart:
    "Despite the title, this video is about efficient technique habits that transfer at any speed level. It's here as a reset before the speed module — to make sure the technique foundation is correct before pushing tempo.",
  polyrhythmBible:
    "5-against-4 is one of the clearest entry points for polyrhythmic feel. El Estepario's visual grid makes the relationship between the two streams visible in a way that musical notation alone cannot.",
  introBlastBeats:
    "The standard Drumeo entry point for blast beats. Clean explanation, good close-ups, covers both hands and feet correctly.",
  blastBeatVariation:
    "George Kollias is one of the most technical blast beat players active. The variations here extend the pattern well beyond basic alternating strokes.",
  derekRoddyBlast:
    "Roddy's stated practice method is push-to-breakdown, drop 10 BPM, play clean, push again. Hearing it from him in the context of blast beat technique is useful even if the specific pattern is not the primary focus.",
  gravityBlast:
    "Gravity blast is a specific technique with limited modern application. This entry is a placeholder until better material is sourced."
}

// Prescription is a function of the step so BPM targets are rendered accurately.
const CONTENT = {
  warmup: {
    why:
      'Warming up with paradiddles targets the wrist motion and hand alternation that everything else in the session relies on. Cold hands make sloppy work. Controlled strokes at moderate tempo activate the forearms without pre-fatiguing them.',
    prescription: (step) => ({
      metronome: `Quarter note click at ${step.bpm_target} BPM`,
      sets: '4 sets x 1 minute',
      method: 'Steady, even pace throughout. This is activation, not performance.',
      approxTime: '8-10 min'
    }),
    tips: [
      "If your hands aren't level on both sides by minute 2, you've found today's actual starting point — slow down",
      'Keep the grid even: 16th notes on the click, not estimated',
      'Grip check: hold the stick the way you would a pencil, not like you are braking a bike'
    ],
    readyWhen:
      'Your weaker hand feels as controlled as your dominant — same grip pressure, same rebound, no extra effort needed to keep up — and your forearms stay relaxed through the full 3 minutes.'
  },

  stamina: {
    why:
      'Djent is physically demanding to play live — a groove that feels fine at 2 minutes is different at 8. Stamina conditioning rebuilds the forearm endurance and playing cardio that went dormant during the layoff. The punk muscle memory is there; the capillary network needs rebuilding.',
    prescription: (step) => {
      const secs = step.stamina_target_seconds || 120
      const mins = Math.floor(secs / 60)
      const rem = secs % 60
      const duration = rem > 0 ? `${mins} min ${rem} sec` : `${mins} min`
      return {
        metronome: 'Optional. Light quarter-note click or none.',
        sets: `1 continuous set: ${duration} without stopping`,
        method:
          'If forearms cramp, drop tempo by 20 BPM — do not stop. Push through the discomfort; stop only on actual pain.',
        approxTime: `${duration} total`
      }
    },
    tips: [
      "If you can't hold a conversation while playing, you're too tense — relax the grip",
      'Focus on grip consistency, not just duration. If the sticks start feeling heavier in one hand, the grip is tightening — consciously release it',
      'The first 90 seconds are always harder than the rest'
    ],
    readyWhen:
      'You can hold the groove for the full target duration without stopping, and the physical effort stays consistent — same grip pressure, same rebound feel, same tempo — from the first bar to the last.'
  },

  subdivisionCounting: {
    why:
      'Polymeter is unreadable without solid subdivision language. Counting is not a beginner exercise — it is how you hear where you are in a repeating pattern. Without it, odd groupings feel like randomness rather than structure.',
    prescription: (step, week) => ({
      metronome: 'Quarter note click at a comfortable tempo',
      sets: '1 set, 5 minutes continuous',
      method:
        week <= 1
          ? '8th notes: count "1 and 2 and 3 and 4 and" out loud. Mouth must move — no silent counting.'
          : week <= 2
          ? '16th notes: count "1 e and a 2 e and a" out loud. Every syllable lands on a 16th note.'
          : 'Odd groupings: count the grouping the polymeter uses (4, 5, or 7 notes). Say the count number of each note as it lands.',
      approxTime: '8-10 min'
    }),
    tips: [
      'Mouth and hands must sync, not just happen at the same time. Slow down until they lock',
      'Count on the breath — the diaphragm helps with timing more than most drummers expect',
      'Do this in front of a mirror: it forces you to keep the mouth moving when concentration rises'
    ],
    readyWhen:
      'You can count the subdivision out loud in sync with the click, and the mouth stays on the beat even when you concentrate hard on the hands.'
  },

  singleStroke: {
    why:
      'Single strokes are the mechanical foundation of every other stroke technique. At speed they reveal any imbalance between your dominant and weak hand — and that imbalance will show up in every advanced pattern if it is not addressed here.',
    prescription: (step) => ({
      metronome: `Quarter note click at ${step.bpm_target} BPM`,
      sets: '4 sets x 2 minutes. 30 seconds rest between sets.',
      method:
        'Push to where the strokes become uneven. Drop 10 BPM. Play clean for 1 minute. Push again. Three clean passes at the new ceiling before moving up.',
      approxTime: '20-25 min'
    }),
    tips: [
      'At high tempos it should be wrists, not arms. If you feel the shoulders working, slow down',
      'Relax the grip between strokes, not just before you start. Tension accumulates mid-set',
      "Record 30 seconds via your module's MIDI out or a phone on the desk — hand timing drift is invisible from the player's seat but obvious on playback"
    ],
    readyWhen:
      'Your weak hand feels as controlled and effortless as your dominant at the target BPM across a full 2-minute set — no timing drift, no extra tension, no sense that one side is working harder than the other.'
  },

  singleKickPlacement: {
    why:
      'In djent, the kick hits on subdivisions, not just on downbeats. A kick that sounds strong on beats 1 and 3 but fluffs on the "and-of-4" makes the pattern collapse. Syncopated placement is what separates groove from metronomic ticking.',
    prescription: (step) => ({
      metronome: `8th-note or 16th-note click at ${step.bpm_target} BPM`,
      sets: '4 sets x 2 minutes. 30 seconds rest between sets.',
      method:
        'Chunk first: right foot alone, then add hi-hat, then add snare. Push to breakdown, drop 10 BPM, play clean, push again.',
      approxTime: '20-25 min'
    }),
    tips: [
      'If the kick drags on syncopations, work the heel-toe technique separately — placement and technique solve each other',
      'Record yourself with a metronome track: kick displacement is harder to hear when you are playing it',
      "Do not try to fix placement at speed. Find the tempo where it's clean, own that, then push"
    ],
    readyWhen:
      'The kick lands clean on every off-beat subdivision at the target BPM through 4 bars of groove, without dragging or rushing on any of them.'
  },

  polymeter: {
    why:
      'This is the technical identity of djent: a kick pattern cycling in an odd grouping against a steady 4/4 on the hands. When the two loops do not share a common period, the kick lands on a different beat of the hand cycle each rep. That drift is not confusion — it is the sound.',
    prescription: (step, week) => {
      const grouping =
        week < 8 ? '4/16' : week < 14 ? '5/16' : week < 22 ? '7/16' : 'combined groupings'
      return {
        metronome: `Quarter note click at ${step.bpm_target} BPM (keep the 4/4 grid audible)`,
        sets: '3 sets x 4 minutes. 45 seconds rest between sets.',
        method: `${grouping} kick grouping. Hands alone first, then kick alone, then combine. Push to breakdown, drop 10 BPM, play clean, push again. Three clean passes before moving up.`,
        approxTime: '20-25 min'
      }
    },
    tips: [
      'Count the kick grouping out loud while your hands play the 4/4. Hard at first, automatic later',
      'Mark the start of each kick cycle (a nod or breath) until you feel where it aligns with 4/4',
      'The goal is for the drift to feel intentional, not accidental. That is the line between polymeter and being lost'
    ],
    readyWhen:
      'You can run the polymeter pattern for 4 minutes with the metronome, feel the kick cycle resolve without counting it out loud, and have the drift feel deliberate.'
  },

  oddTime: {
    why:
      'Odd meters are the structural language of progressive metal. A 5/4 groove sounds strange until you have played it a thousand times — then it sounds inevitable. Getting the grooves in the body before you need to play them is how you avoid counting forever.',
    prescription: (step, week) => ({
      metronome: 'Downbeat click (one click per bar). Quarter note optional.',
      sets: '5 minutes per groove. Maximum 2 new grooves per session.',
      method:
        'Count out loud before adding hands. When the count feels solid, drop it and rely on feel. If you lose the meter, restart at the phrase boundary — do not try to reconnect mid-bar.',
      approxTime: '15-20 min'
    }),
    tips: [
      'Play the groove on your lap before moving to the kit — simpler surface, cleaner learning',
      'Mark the phrase boundary (the "1") physically with a head nod until it becomes automatic',
      'The groove must feel like 4/4 eventually, not like counting. That is the target state'
    ],
    readyWhen:
      'You can play the odd-time groove at tempo, loop back to bar 1 without losing your place, and do it without counting out loud.'
  },

  linearFills: {
    why:
      'Linear playing means no two voices hit simultaneously. It creates a different textural density than standard fills — more open, harder to execute cleanly, because there is no overlapping mass to hide behind.',
    prescription: (step) => ({
      metronome: `Quarter note click. Start well below ${step.bpm_target} BPM — accuracy before speed.`,
      sets: '4 sets x 1.5 minutes per variation. Learn the pattern hands-alone first, then add the foot.',
      method:
        'Add one new variation per session. Play all known variations back-to-back without stopping before the session ends.',
      approxTime: '15-20 min'
    }),
    tips: [
      'Slow is not optional. Linear patterns break at speed if they were not clean at slow first',
      'Count the pattern in 16th notes before adding feel or dynamics',
      "Record yourself: unintended double-hits sound fine from the drummer's seat but are clearly audible on playback"
    ],
    readyWhen:
      'You can play all variations learned so far back-to-back without stopping, and the foot lands cleanly without rushing the following hand stroke.'
  },

  apply: {
    why:
      'Drills create the pattern. Musical context creates the skill. Playing a figure in a real phrase — with a start, a transition, and a landing point — is different from repeating it in isolation. This is where it stops being practice and starts being playing.',
    prescription: () => ({
      metronome: 'Light click or none. Let the phrase drive the time.',
      sets: '8 bars looped. Minimum 5 clean loops before you stop.',
      method:
        'Start the pattern on bar 1, land cleanly on bar 8, then loop without stopping. No editing. If it breaks, let the next loop recover it.',
      approxTime: '10-15 min'
    }),
    tips: [
      'If you are thinking about the mechanics during the apply step, slow down until you are not',
      'Try it with an actual song or drum loop in the background if you have one at the right tempo',
      'The phrase boundary should feel obvious, not calculated. That is the test'
    ],
    readyWhen:
      'You can run the phrase 5 times back-to-back, land on bar 1 each time, and it feels musical rather than calculated.'
  }
}

export function getStepDetails(step, skillKey, week) {
  if (!step || !step.type) return null

  const videoNote = step.video_id ? VIDEO_NOTES[step.video_id] || null : null

  if (step.type === 'warmup') {
    const c = CONTENT.warmup
    return {
      why: c.why,
      videoNote,
      prescription: c.prescription(step),
      tips: c.tips,
      readyWhen: c.readyWhen
    }
  }

  if (step.type === 'apply') {
    const c = CONTENT.apply
    return {
      why: c.why,
      videoNote: null,
      prescription: c.prescription(step, week),
      tips: c.tips,
      readyWhen: c.readyWhen
    }
  }

  // core step — skill-specific
  if (step.type === 'core') {
    const c = CONTENT[skillKey] || null
    if (!c) return { why: null, videoNote, prescription: null, tips: [], readyWhen: null }
    return {
      why: c.why,
      videoNote,
      prescription: c.prescription(step, week),
      tips: c.tips,
      readyWhen: c.readyWhen
    }
  }

  return null
}
