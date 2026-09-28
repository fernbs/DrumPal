import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { writeFileSync, mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Inline the data to avoid ESM import path issues in the script context
const SKILLS = {
  stamina: {
    key: 'stamina', label: 'Stamina', unit: 'seconds',
    introducedWeek: 1, retiredWeek: 52, category: 'conditioning',
    targetAtWeek: (week) => {
      if (week <= 1) return 120;
      if (week <= 4) return 120 + (week - 1) * 60;
      if (week <= 8) return 300 + (week - 4) * 45;
      return 480;
    }
  },
  subdivisionCounting: {
    key: 'subdivisionCounting', label: 'Subdivision Counting', unit: 'level',
    introducedWeek: 1, retiredWeek: 3, category: 'rhythmFoundations',
    targetAtWeek: (week) => Math.min(week, 3)
  },
  singleStroke: {
    key: 'singleStroke', label: 'Single Stroke Roll', unit: 'bpm',
    introducedWeek: 1, retiredWeek: 52, category: 'foundation',
    targetAtWeek: (week) => Math.round(90 + ((week - 1) / 51) * 60)
  },
  singleKickPlacement: {
    key: 'singleKickPlacement', label: 'Single Kick Placement', unit: 'bpm',
    introducedWeek: 1, retiredWeek: 52, category: 'feet',
    targetAtWeek: (week) => Math.round(70 + ((week - 1) / 51) * 80)
  },
  polymeter: {
    key: 'polymeter', label: 'Polymeter / Djent Patterns', unit: 'bpm',
    introducedWeek: 3, retiredWeek: 52, category: 'djent',
    targetAtWeek: (week) => {
      if (week < 3) return 0;
      return Math.round(70 + ((week - 3) / 49) * 70);
    },
    groupingAtWeek: (week) => {
      if (week < 3) return null;
      if (week < 8) return '4/16';
      if (week < 14) return '5/16';
      if (week < 22) return '7/16';
      return 'combined';
    }
  },
  oddTime: {
    key: 'oddTime', label: 'Odd Time', unit: 'grooves',
    introducedWeek: 10, retiredWeek: 52, category: 'oddtime',
    targetAtWeek: (week) => {
      if (week < 10) return 0;
      return Math.floor((week - 10) / 2) + 1;
    }
  },
  linearFills: {
    key: 'linearFills', label: 'Linear Fills', unit: 'variations',
    introducedWeek: 20, retiredWeek: 52, category: 'linear',
    targetAtWeek: (week) => {
      if (week < 20) return 0;
      return Math.floor((week - 20) / 3) + 1;
    }
  }
};

const MODULES = [
  { id: 1, title: 'Foundation and Stamina Rebuild', weeks: [1, 4], spotlightSkills: ['stamina', 'subdivisionCounting', 'singleStroke', 'singleKickPlacement'] },
  { id: 2, title: 'First Polymeter', weeks: [5, 9], spotlightSkills: ['polymeter', 'singleKickPlacement', 'stamina'] },
  { id: 3, title: 'Polymeter Deeper and Odd Time Intro', weeks: [10, 13], spotlightSkills: ['polymeter', 'oddTime', 'singleStroke'] },
  { id: 4, title: 'Odd Time and Speed', weeks: [14, 19], spotlightSkills: ['polymeter', 'oddTime', 'singleKickPlacement', 'singleStroke'] },
  { id: 5, title: 'Linear Fills', weeks: [20, 27], spotlightSkills: ['linearFills', 'polymeter', 'oddTime'] },
  { id: 6, title: 'Integration', weeks: [28, 35], spotlightSkills: ['polymeter', 'linearFills', 'oddTime', 'singleKickPlacement'] },
  { id: 7, title: 'Advanced Application', weeks: [36, 44], spotlightSkills: ['polymeter', 'linearFills', 'singleStroke', 'singleKickPlacement'] },
  { id: 8, title: 'Mastery', weeks: [45, 52], spotlightSkills: ['polymeter', 'linearFills', 'oddTime', 'stamina'] }
];

function moduleForWeek(week) {
  return MODULES.find(m => week >= m.weeks[0] && week <= m.weeks[1]);
}

// Video assignment by skill and week
function getSetVideo(skillKey, week, lessonIndex) {
  const alt = lessonIndex % 2 === 0;
  const rot3 = lessonIndex % 3;
  switch (skillKey) {
    case 'stamina':
      return { id: 'syncKickWorkout', title: 'Syncopated Bass Drum Workout (60-90-100bpm)', url: 'https://www.youtube.com/watch?v=vKq9xk0dUxM' };
    case 'subdivisionCounting':
      return { id: 'subdivisionCounting', title: 'How to Count Sixteenth Notes', url: 'https://www.youtube.com/watch?v=vuk_oC5niP8' };
    case 'singleStroke':
      return alt
        ? { id: 'singleParadiddle', title: 'Single Paradiddle', url: 'https://www.youtube.com/watch?v=-imiZIrGwXE' }
        : { id: 'singleParadiddleDiddle', title: 'Single Paradiddle-Diddle', url: 'https://www.youtube.com/watch?v=0z58p1nd4PQ' };
    case 'singleKickPlacement':
      return alt
        ? { id: 'heelToe', title: 'Heel-Toe Bass Drum Technique', url: 'https://www.youtube.com/watch?v=xHqkxHaQ-bI' }
        : { id: 'syncKickWorkout', title: 'Syncopated Bass Drum Workout (60-90-100bpm)', url: 'https://www.youtube.com/watch?v=vKq9xk0dUxM' };
    case 'polymeter':
      if (week < 8) return { id: 'polyrhythmVsPolymeter', title: 'How To Easily Explain Polyrhythm vs Polymeter', url: 'https://www.youtube.com/watch?v=08hmJd1BVKk' };
      if (week < 16) return { id: 'jayPostonesOddTime', title: 'ODD TIMED DRUMMING — Drum Lesson', url: 'https://www.youtube.com/watch?v=w83rbm4JBo0' };
      return alt
        ? { id: 'jayPostonesMeshuggah', title: 'Drum Composition Hack For Odd-Timed Grooves', url: 'https://www.youtube.com/watch?v=xi2X3KiL7gM' }
        : { id: 'bleedMeshuggah', title: 'Bleed by Meshuggah — Drum Lesson Breakdown', url: 'https://www.youtube.com/watch?v=QCBr1ws2JYo' };
    case 'oddTime':
      return week < 20
        ? { id: 'oddTimeGrooves', title: 'Go-To Odd Time Grooves', url: 'https://www.youtube.com/watch?v=mvHa9mokz_I' }
        : { id: 'dannyCarey', title: "Danny Carey's Tools Of The Trade", url: 'https://www.youtube.com/watch?v=-Emut0-LYJE' };
    case 'linearFills':
      return alt
        ? { id: 'linearSingles', title: 'How To Play Linear Singles', url: 'https://www.drumeo.com/beat/how-to-play-linear-singles/' }
        : { id: 'rudingerChannel', title: 'Alex Rudinger — Full Channel', url: 'https://www.youtube.com/user/mdterps1042' };
    default: {
      const speedVids = [
        { id: 'bassDrumSpeed', title: 'Bass Drum Speed Secrets, Part 1', url: 'https://www.youtube.com/watch?v=tWJGx7YbauQ' },
        { id: 'esteparioStart', title: 'New Drummers Start Here', url: 'https://www.youtube.com/watch?v=YxHnzqeoER4' },
        { id: 'polyrhythmBible', title: 'The Polyrhythm Bible: 5 Against 4', url: 'https://www.youtube.com/watch?v=95Sdpqu3Hno' }
      ];
      return speedVids[rot3];
    }
  }
}

function getWarmupVideo(lessonIndex) {
  return lessonIndex % 2 === 0
    ? { id: 'singleParadiddle', title: 'Single Paradiddle', url: 'https://www.youtube.com/watch?v=-imiZIrGwXE' }
    : { id: 'singleParadiddleDiddle', title: 'Single Paradiddle-Diddle', url: 'https://www.youtube.com/watch?v=0z58p1nd4PQ' };
}

// Instruction text generators — vary by week position, not flat strings
function warmupInstruction(bpm, week) {
  const targets = [
    `Foundation check. Single strokes at ${bpm} BPM. Even stick height, even volume, even timing. If anything drifts, slow down 10 BPM and make it right before moving up.`,
    `Warm up with single strokes at ${bpm} BPM. This isn't the hard part of the session — but don't sleep through it. Check your grip, check your posture, make it count.`,
    `Start the session with single strokes at ${bpm} BPM. Week ${week} tempo. Keep the metronome honest — if you can't hear yourself locking with it, you're not locked with it.`
  ];
  return targets[week % targets.length];
}

function coreInstruction(skillKey, week, bpmTarget, skill) {
  const weeksIn = week - skill.introducedWeek;

  if (skillKey === 'stamina') {
    const mins = Math.round(bpmTarget / 60);
    const secs = bpmTarget % 60;
    const target = secs > 0 ? `${mins} min ${secs} sec` : `${mins} min`;
    if (week <= 4) {
      return `Groove continuously for ${target}. Single kick and hi-hat pattern, whatever feels comfortable. Stop if your forearms cramp — that's the signal, not failure. Week ${week}: rebuild the cardio, don't blow it up.`;
    }
    if (week <= 8) {
      return `Continuous groove for ${target}. You're ${weeksIn} weeks into stamina conditioning. The punk muscle memory is coming back — trust it. Don't stop unless you have to.`;
    }
    return `8-minute groove hold. You should own this by now. If it still feels hard, note that — it's diagnostic. The goal is effortless, not gritted teeth.`;
  }

  if (skillKey === 'subdivisionCounting') {
    const levels = ['', '8th notes: count "1 and 2 and 3 and 4 and" out loud over a click', '16th notes: count "1 e and a 2 e and a" out loud over a click', 'odd groupings: count the groupings the polymeter uses (4 notes, 5 notes, 7 notes)'];
    const level = Math.min(week, 3);
    return `Count out loud. ${levels[level]}. Don't just think it — say it. The coordination between mouth, ears, and hands is the whole point. 5 minutes here saves 50 minutes of confusion later.`;
  }

  if (skillKey === 'polymeter') {
    const grouping = skill.groupingAtWeek(week);
    const groupingLabel = grouping || '4/16';
    if (week <= 10) {
      return `${groupingLabel} kick grouping against a steady 4/4 on the hands. Start slow. Chunk it: kick alone first, then hands alone, then combine at ${bpmTarget} BPM. Push to where it starts breaking, drop 10 BPM, play clean, then push again. This is genuinely new territory — treat it like a beginner would.`;
    }
    if (week <= 30) {
      return `${groupingLabel} polymeter. You've had this concept for ${weeksIn} weeks. Target: ${bpmTarget} BPM. The goal is consistency, not just hitting the number once. 3 clean passes before moving up. Notice which beat of the hand cycle the kick lands on — that drift is the whole point.`;
    }
    return `${groupingLabel} polymeter at ${bpmTarget} BPM. This is near your ceiling. Use the push-breakdown-drop method. If you can't play it clean 3 times at this tempo, it's not your tempo yet. Don't fake it — the groove has to feel mechanical, not effortful.`;
  }

  if (skillKey === 'oddTime') {
    const grooveCount = skill.targetAtWeek(week);
    if (weeksIn === 0) {
      return `First odd time groove. Start with 5/4: count "1 2 3 4 5" and feel where the downbeat lands each bar. It will feel wrong for a while. That's normal — you're retraining where "1" is. Slow click, count out loud.`;
    }
    if (week <= 20) {
      return `Odd time groove #${grooveCount}. You've been here ${weeksIn} weeks. Today's meter: ${grooveCount % 2 === 0 ? '7/8' : '5/4'}. Same approach — count out loud first, feel the bar shape before you add dynamics.`;
    }
    return `Odd time at week ${week}. ${grooveCount} grooves in your toolkit. Today's focus: make it feel like 4/4, not like counting. The groove has to become natural, not calculated.`;
  }

  if (skillKey === 'linearFills') {
    const varCount = skill.targetAtWeek(week);
    if (weeksIn === 0) {
      return `First linear fill. No two voices hit simultaneously — that's the rule. Start with a simple 16th-note hand-foot pattern: RLKR LKRL. Slow. Watch Alex Rudinger's posture and limb independence, not just the speed.`;
    }
    if (week <= 35) {
      return `Linear fills — variation ${varCount}. You've had this ${weeksIn} weeks. Add the new variation today, then play all previous variations back-to-back. Muscle memory builds from repetition, not from learning new things and forgetting old ones.`;
    }
    return `Linear fills at week ${week}. ${varCount} variations in the toolkit. Today's goal: chain 3 different variations without stopping. That's performance-ready linear playing.`;
  }

  if (skillKey === 'singleKickPlacement') {
    if (week <= 10) {
      return `Single kick placement at ${bpmTarget} BPM. Syncopated pattern — kick on the "e" or "a" of each beat. Start slow. Chunk it: right foot alone, then add hands. Push to where it starts breaking, drop 10 BPM, play clean, then push again.`;
    }
    if (week <= 30) {
      return `Kick placement at ${bpmTarget} BPM. ${weeksIn} weeks in. The coordination should feel more automatic now. If it doesn't, go back to heel-toe technique — placement and technique solve each other.`;
    }
    return `Kick placement at ${bpmTarget} BPM — near ceiling. At this tempo, every mis-hit is audible. Precision over speed: if you can't land it cleanly, slow down 5 BPM.`;
  }

  if (skillKey === 'singleStroke') {
    if (week <= 10) {
      return `Single stroke roll at ${bpmTarget} BPM. You're coming back from a layoff — this should feel familiar fast. Don't force speed. Push to where it gets sloppy, drop 10 BPM, play clean, push again.`;
    }
    if (week <= 30) {
      return `Single strokes at ${bpmTarget} BPM. Week ${week}. ${weeksIn} weeks of consistent work. Check: are you using your wrists or arms? At this tempo it should be wrists. Relax the grip.`;
    }
    return `Single strokes at ${bpmTarget} BPM. Near the top of the ramp. Play in front of a mirror or camera — at high tempos, technique breaks down invisibly. Watch for grip drift.`;
  }

  // fallback
  return `Target: ${bpmTarget} BPM. Push to where it starts breaking, drop 10 BPM, play clean, then push again.`;
}

function consolidationInstruction(week) {
  return `Consolidation day. No new material. Go back to this week's hardest drill and play it at a tempo you genuinely own — not the target, the one where it's clean. Then record 15-30 seconds. You don't need it to be perfect. You need to hear where you actually are. Week ${week}.`;
}

function encoreInstruction(skillKey, week) {
  const grooveLabels = {
    polymeter: 'the polymeter kick pattern',
    linearFills: 'a linear fill',
    oddTime: 'the odd time groove',
    singleKickPlacement: 'the syncopated kick',
    singleStroke: 'the single stroke roll',
    stamina: 'a groove you enjoy',
    subdivisionCounting: 'counted 16th notes over a groove'
  };
  const label = grooveLabels[skillKey] || 'today\'s pattern';
  return `Drop ${label} into 8 bars. Don't think of it as a drill — think of it as something you'd actually play in a song. Loop it until it stops feeling like practice. Week ${week}.`;
}

// Build a lesson title
function lessonTitle(isConsolidation, module, lessonInModule, spotlightSkill, week) {
  if (isConsolidation) return `Week ${week} — Consolidation`;
  const skillLabels = {
    stamina: 'Stamina Build',
    subdivisionCounting: 'Subdivision Counting',
    singleStroke: 'Single Stroke Speed',
    singleKickPlacement: 'Kick Placement',
    polymeter: 'Polymeter / Djent',
    oddTime: 'Odd Time',
    linearFills: 'Linear Fills'
  };
  return `Week ${week} — ${skillLabels[spotlightSkill] || spotlightSkill}`;
}

// Main generation
const lessons = [];
const steps = [];
let stepId = 1;

// Track lessons per module for lesson_in_module counter
const moduleLessonCounters = {};

for (let lessonId = 1; lessonId <= 260; lessonId++) {
  const week = Math.ceil(lessonId / 5);
  const dayInWeek = ((lessonId - 1) % 5) + 1;
  const isConsolidation = dayInWeek === 5;
  const mod = moduleForWeek(week);
  const moduleId = mod ? mod.id : 8;

  if (!moduleLessonCounters[moduleId]) moduleLessonCounters[moduleId] = 0;
  moduleLessonCounters[moduleId]++;
  const lessonInModule = moduleLessonCounters[moduleId];

  // Pick spotlight skill for this lesson
  const spotlightSkills = mod ? mod.spotlightSkills : ['polymeter'];
  // Rotate through spotlight skills, but only those active this week
  const activeSpotlight = spotlightSkills.filter(sk => {
    const skill = SKILLS[sk];
    return skill && week >= skill.introducedWeek && week <= skill.retiredWeek;
  });
  const spotlightSkill = activeSpotlight[lessonInModule % activeSpotlight.length] || 'singleStroke';
  const skill = SKILLS[spotlightSkill];
  const bpmTarget = skill ? Math.round(skill.targetAtWeek(week)) : null;
  const staminaTarget = spotlightSkill === 'stamina' ? (skill ? skill.targetAtWeek(week) : null) : null;

  const title = lessonTitle(isConsolidation, moduleId, lessonInModule, spotlightSkill, week);

  lessons.push({
    id: lessonId,
    week,
    day_in_week: dayInWeek,
    module: moduleId,
    lesson_in_module: lessonInModule,
    is_consolidation: isConsolidation ? 1 : 0,
    title,
    skill_focus: spotlightSkill
  });

  if (isConsolidation) {
    // Consolidation: 1 core step only (no warmup video, no encore)
    steps.push({
      id: stepId++,
      lesson_id: lessonId,
      step_order: 1,
      type: 'core',
      video_id: null,
      video_title: null,
      video_url: null,
      instruction: consolidationInstruction(week),
      bpm_target: null,
      stamina_target_seconds: null
    });
  } else {
    // Warmup step
    const warmupVid = getWarmupVideo(lessonId);
    const warmupBpm = SKILLS.singleStroke.targetAtWeek(week);
    steps.push({
      id: stepId++,
      lesson_id: lessonId,
      step_order: 1,
      type: 'warmup',
      video_id: warmupVid.id,
      video_title: warmupVid.title,
      video_url: warmupVid.url,
      instruction: warmupInstruction(warmupBpm, week),
      bpm_target: warmupBpm,
      stamina_target_seconds: null
    });

    // Core step
    const setVid = getSetVideo(spotlightSkill, week, lessonId);
    steps.push({
      id: stepId++,
      lesson_id: lessonId,
      step_order: 2,
      type: 'core',
      video_id: setVid.id,
      video_title: setVid.title,
      video_url: setVid.url,
      instruction: coreInstruction(spotlightSkill, week, bpmTarget, skill),
      bpm_target: spotlightSkill !== 'stamina' ? bpmTarget : null,
      stamina_target_seconds: staminaTarget
    });

    // Encore step (no video)
    steps.push({
      id: stepId++,
      lesson_id: lessonId,
      step_order: 3,
      type: 'apply',
      video_id: null,
      video_title: null,
      video_url: null,
      instruction: encoreInstruction(spotlightSkill, week),
      bpm_target: null,
      stamina_target_seconds: null
    });
  }
}

// Write seed.sql
function esc(str) {
  if (str === null || str === undefined) return 'NULL';
  return `'${String(str).replace(/'/g, "''")}'`;
}

const lines = ['-- Generated lesson seed data. Re-run scripts/generateLessons.js to regenerate.', ''];

lines.push('-- lessons');
for (const l of lessons) {
  lines.push(
    `INSERT OR IGNORE INTO lessons (id, week, day_in_week, module, lesson_in_module, is_consolidation, title, skill_focus) VALUES (${l.id}, ${l.week}, ${l.day_in_week}, ${l.module}, ${l.lesson_in_module}, ${l.is_consolidation}, ${esc(l.title)}, ${esc(l.skill_focus)});`
  );
}

lines.push('');
lines.push('-- steps');
for (const s of steps) {
  lines.push(
    `INSERT OR IGNORE INTO steps (id, lesson_id, step_order, type, video_id, video_title, video_url, instruction, bpm_target, stamina_target_seconds) VALUES (${s.id}, ${s.lesson_id}, ${s.step_order}, ${esc(s.type)}, ${esc(s.video_id)}, ${esc(s.video_title)}, ${esc(s.video_url)}, ${esc(s.instruction)}, ${s.bpm_target === null ? 'NULL' : s.bpm_target}, ${s.stamina_target_seconds === null ? 'NULL' : s.stamina_target_seconds});`
  );
}

const outPath = join(__dirname, '..', 'db', 'seed.sql');
mkdirSync(join(__dirname, '..', 'db'), { recursive: true });
writeFileSync(outPath, lines.join('\n'), 'utf8');

console.log(`Generated ${lessons.length} lessons and ${steps.length} steps.`);
console.log(`Seed file written to db/seed.sql (${lines.length} lines)`);
