export const SKILLS = {
  stamina: {
    key: 'stamina',
    label: 'Stamina',
    unit: 'seconds',
    introducedWeek: 1,
    retiredWeek: 52,
    category: 'conditioning',
    targetAtWeek: (week) => {
      if (week <= 1) return 120;
      if (week <= 4) return 120 + (week - 1) * 60;
      if (week <= 8) return 300 + (week - 4) * 45;
      return 480;
    }
  },
  subdivisionCounting: {
    key: 'subdivisionCounting',
    label: 'Subdivision Counting',
    unit: 'level',
    introducedWeek: 1,
    retiredWeek: 3,
    category: 'rhythmFoundations',
    targetAtWeek: (week) => Math.min(week, 3)
  },
  singleStroke: {
    key: 'singleStroke',
    label: 'Single Stroke Roll',
    unit: 'bpm',
    introducedWeek: 1,
    retiredWeek: 52,
    category: 'foundation',
    targetAtWeek: (week) => Math.round(90 + ((week - 1) / 51) * 60)
  },
  singleKickPlacement: {
    key: 'singleKickPlacement',
    label: 'Single Kick Placement',
    unit: 'bpm',
    introducedWeek: 1,
    retiredWeek: 52,
    category: 'feet',
    targetAtWeek: (week) => Math.round(70 + ((week - 1) / 51) * 80)
  },
  polymeter: {
    key: 'polymeter',
    label: 'Polymeter / Djent Patterns',
    unit: 'bpm',
    introducedWeek: 3,
    retiredWeek: 52,
    category: 'djent',
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
    key: 'oddTime',
    label: 'Odd Time',
    unit: 'grooves',
    introducedWeek: 10,
    retiredWeek: 52,
    category: 'oddtime',
    targetAtWeek: (week) => {
      if (week < 10) return 0;
      return Math.floor((week - 10) / 2) + 1;
    }
  },
  linearFills: {
    key: 'linearFills',
    label: 'Linear Fills',
    unit: 'variations',
    introducedWeek: 20,
    retiredWeek: 52,
    category: 'linear',
    targetAtWeek: (week) => {
      if (week < 20) return 0;
      return Math.floor((week - 20) / 3) + 1;
    }
  }
};

export const SKILL_KEYS = Object.keys(SKILLS);

export function activeSkillsForWeek(week) {
  return Object.values(SKILLS).filter(
    s => week >= s.introducedWeek && week <= s.retiredWeek
  );
}
