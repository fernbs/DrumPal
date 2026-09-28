export const MODULES = [
  {
    id: 1,
    title: 'Foundation and Stamina Rebuild',
    weeks: [1, 4],
    description: 'Rebuild playing endurance, nail subdivision counting, and lock in single strokes and kick placement. Ends with the Fantini independence bridge that leads directly into polymeter.',
    spotlightSkills: ['stamina', 'subdivisionCounting', 'singleStroke', 'singleKickPlacement']
  },
  {
    id: 2,
    title: 'First Polymeter',
    weeks: [5, 9],
    description: 'The 4/16 kick grouping against a steady 4/4 on the hands. This is where djent starts. Slow, deliberate, and chunked into small pieces before combining.',
    spotlightSkills: ['polymeter', 'singleKickPlacement', 'stamina']
  },
  {
    id: 3,
    title: 'Polymeter Deeper and Odd Time Intro',
    weeks: [10, 13],
    description: 'Stretch the kick grouping to 5/16. Introduce odd time meters as a parallel track. The two ideas reinforce each other.',
    spotlightSkills: ['polymeter', 'oddTime', 'singleStroke']
  },
  {
    id: 4,
    title: 'Odd Time and Speed',
    weeks: [14, 19],
    description: '7/16 kick polymeter. Odd time grooves (5/4, 7/8). Speed work on hands and feet running in parallel.',
    spotlightSkills: ['polymeter', 'oddTime', 'singleKickPlacement', 'singleStroke']
  },
  {
    id: 5,
    title: 'Linear Fills',
    weeks: [20, 27],
    description: 'Linear fills enter the picture. The drumming starts sounding like modern metal. Polymeter moves into combined groupings.',
    spotlightSkills: ['linearFills', 'polymeter', 'oddTime']
  },
  {
    id: 6,
    title: 'Integration',
    weeks: [28, 35],
    description: "All tracks running together. Application focus: drop the week's patterns into actual musical contexts, not just isolated drills.",
    spotlightSkills: ['polymeter', 'linearFills', 'oddTime', 'singleKickPlacement']
  },
  {
    id: 7,
    title: 'Advanced Application',
    weeks: [36, 44],
    description: 'Advanced polymeter, real song breakdowns (Bleed, TesseracT), and speed targets approaching ceiling.',
    spotlightSkills: ['polymeter', 'linearFills', 'singleStroke', 'singleKickPlacement']
  },
  {
    id: 8,
    title: 'Mastery',
    weeks: [45, 52],
    description: "Final polish. All skill tracks near their ceiling. Performance-ready playing. The year's work clicks into place.",
    spotlightSkills: ['polymeter', 'linearFills', 'oddTime', 'stamina']
  }
];

export function moduleForWeek(week) {
  return MODULES.find(m => week >= m.weeks[0] && week <= m.weeks[1]);
}
