import { useState } from 'react'
import YouTubePlayer from './YouTubePlayer'
import { getStepDetails } from '../data/stepDetails.js'

const STEP_LABELS = {
  warmup: 'Warm-Up',
  core: 'Core Lesson',
  apply: 'Apply It'
}

const STEP_SUBTITLES = {
  warmup: 'Foundation work to open the session',
  core: 'The main skill for today',
  apply: 'Drop it into musical context'
}

const MODULE_NAMES = {
  1: 'Foundation and Stamina Rebuild',
  2: 'First Polymeter',
  3: 'Polymeter Deeper and Odd Time Intro',
  4: 'Odd Time and Speed',
  5: 'Linear Fills',
  6: 'Integration',
  7: 'Advanced Application',
  8: 'Mastery'
}

const SKILL_LOGGER = {
  stamina: {
    label: 'Stamina',
    prompt: 'How long did you groove continuously today?',
    inputLabel: 'minutes',
    unit: 'min',
    placeholder: '8',
    step: 0.5,
    min: 0.5,
    max: 60
  },
  singleStroke: {
    label: 'Single Stroke Roll',
    prompt: 'What BPM did you reach cleanly today?',
    inputLabel: 'BPM',
    unit: 'bpm',
    placeholder: '110',
    step: 1,
    min: 60,
    max: 300
  },
  singleKickPlacement: {
    label: 'Single Kick Placement',
    prompt: 'What BPM did you reach cleanly today?',
    inputLabel: 'BPM',
    unit: 'bpm',
    placeholder: '100',
    step: 1,
    min: 60,
    max: 250
  },
  polymeter: {
    label: 'Polymeter',
    prompt: 'What BPM did you run the pattern cleanly today?',
    inputLabel: 'BPM',
    unit: 'bpm',
    placeholder: '90',
    step: 1,
    min: 60,
    max: 200
  },
  oddTime: {
    label: 'Odd Time',
    prompt: 'How many odd-time grooves can you play solid?',
    inputLabel: 'grooves',
    unit: 'grooves',
    placeholder: '3',
    step: 1,
    min: 1,
    max: 50
  },
  linearFills: {
    label: 'Linear Fills',
    prompt: 'How many variations can you play back-to-back without stopping?',
    inputLabel: 'variations',
    unit: 'variations',
    placeholder: '2',
    step: 1,
    min: 1,
    max: 30
  }
}

function extractYoutubeId(url) {
  if (!url) return null
  const m = url.match(/[?&]v=([^&]+)/)
  return m ? m[1] : null
}

function formatStamina(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return s > 0 ? `${m} min ${s} sec` : `${m} min`
}

function StepCard({ step, index, skillKey, week, isConsolidation, progressSet, onToggleProgress }) {
  const ytId = extractYoutubeId(step.video_url)
  const isExternalLink = step.video_url && !ytId
  const details = isConsolidation ? null : getStepDetails(step, skillKey, week)

  const watched = progressSet.has(`${step.id}:watch`)
  const drilled = progressSet.has(`${step.id}:drill`)

  return (
    <div className={`step-card${drilled ? ' step-card-done' : ''}`}>
      <div className="step-card-header">
        <span className="step-number">{index + 1}</span>
        <div>
          <div className="step-label">{STEP_LABELS[step.type] || step.type}</div>
          <div className="step-subtitle">{STEP_SUBTITLES[step.type] || ''}</div>
        </div>
      </div>

      {ytId && (
        <YouTubePlayer videoId={ytId} title={step.video_title} />
      )}

      {isExternalLink && (
        <a
          href={step.video_url}
          target="_blank"
          rel="noopener noreferrer"
          className="step-open-btn"
        >
          {step.video_title ? `Open: ${step.video_title}` : 'Open Lesson'}
        </a>
      )}

      {details?.why && (
        <div className="step-detail-block">
          <div className="step-detail-label">Why this exercise</div>
          <p className="step-detail-text">{details.why}</p>
        </div>
      )}

      {details?.builds?.length > 0 && (
        <div className="step-detail-block">
          <div className="step-detail-label">What it builds</div>
          <ul className="step-builds-list">
            {details.builds.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        </div>
      )}

      {details?.videoNote && (
        <div className="step-detail-block step-video-note">
          <div className="step-detail-label">About this video</div>
          <p className="step-detail-text">{details.videoNote}</p>
        </div>
      )}

      <p className="step-instruction">{step.instruction}</p>

      {details?.prescription && (
        <div className="step-prescription">
          <div className="step-detail-label">How to practise</div>
          <dl className="step-prescription-grid">
            {details.prescription.metronome && (
              <>
                <dt>Metronome</dt>
                <dd>{details.prescription.metronome}</dd>
              </>
            )}
            {details.prescription.sets && (
              <>
                <dt>Sets</dt>
                <dd>{details.prescription.sets}</dd>
              </>
            )}
            {details.prescription.method && (
              <>
                <dt>Method</dt>
                <dd>{details.prescription.method}</dd>
              </>
            )}
          </dl>
        </div>
      )}

      {details?.tips?.length > 0 && (
        <div className="step-detail-block">
          <div className="step-detail-label">Tips</div>
          <ul className="step-tips-list">
            {details.tips.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </div>
      )}

      {step.bpm_target && (
        <div className="step-target">
          Target: <strong>{step.bpm_target} BPM</strong>
        </div>
      )}

      {step.stamina_target_seconds && (
        <div className="step-target">
          Target: <strong>{formatStamina(step.stamina_target_seconds)} continuous</strong>
        </div>
      )}

      <div className="step-toggles">
        {step.video_url && (
          <button
            className={`step-toggle${watched ? ' step-toggle-watched' : ''}`}
            onClick={() => onToggleProgress(step.id, 'watch', !watched)}
          >
            {watched ? '✓ Watched' : 'Mark watched'}
          </button>
        )}
        <button
          className={`step-toggle step-toggle-drill-btn${drilled ? ' step-toggle-drilled' : ''}`}
          onClick={() => onToggleProgress(step.id, 'drill', !drilled)}
        >
          {drilled ? '✓ Drilled' : 'Mark drilled'}
        </button>
      </div>
    </div>
  )
}

function BpmLogger({ lesson, bests, onLogBest }) {
  const config = SKILL_LOGGER[lesson.skill_focus]
  const [val, setVal] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [saving, setSaving] = useState(false)

  if (!config) return null

  const currentBest = bests.find(b => b.skill_key === lesson.skill_focus)

  async function handleSubmit(e) {
    e.preventDefault()
    const num = parseFloat(val)
    if (!num || num <= 0) return
    setSaving(true)
    const result = await onLogBest(lesson.skill_focus, num, config.unit, lesson.id)
    setSaving(false)
    if (result) {
      setFeedback(result)
      setVal('')
    }
  }

  return (
    <div className="bpm-logger">
      <div className="bpm-logger-header">
        <div className="step-detail-label">{config.label} — Log your session</div>
        {currentBest && (
          <div className="bpm-best-pill">
            Best: <strong>{currentBest.value} {currentBest.unit}</strong>
          </div>
        )}
      </div>
      <p className="bpm-logger-prompt">{config.prompt}</p>
      <form className="bpm-logger-form" onSubmit={handleSubmit}>
        <input
          type="number"
          className="bpm-input"
          value={val}
          onChange={e => { setVal(e.target.value); setFeedback(null) }}
          placeholder={config.placeholder}
          min={config.min}
          max={config.max}
          step={config.step}
        />
        <span className="bpm-input-unit">{config.inputLabel}</span>
        <button
          type="submit"
          className="bpm-log-btn"
          disabled={saving || !val}
        >
          {saving ? '...' : 'Log it'}
        </button>
      </form>
      {feedback && (
        <div className={`bpm-feedback${feedback.is_new_best ? ' bpm-feedback-best' : ''}`}>
          {feedback.is_new_best
            ? `New personal best: ${feedback.logged} ${config.unit}`
            : `Logged. Personal best is still ${feedback.best?.value} ${config.unit}.`}
        </div>
      )}
    </div>
  )
}

export default function LessonPane({ lesson, progressSet, lessons, onSelectLesson, onToggleProgress, onLogBest, bests }) {
  const currentIndex = lessons.findIndex(l => l.id === lesson.id)
  const nextLesson = currentIndex >= 0 && currentIndex < lessons.length - 1
    ? lessons[currentIndex + 1]
    : null
  const isConsolidation = Boolean(lesson.is_consolidation)

  function handleMarkComplete() {
    for (const step of lesson.steps) {
      if (!progressSet.has(`${step.id}:drill`)) {
        onToggleProgress(step.id, 'drill', true)
      }
    }
    if (nextLesson) {
      onSelectLesson(nextLesson.id)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className="lesson-pane">
      <div className="lesson-header">
        <div className="lesson-meta">
          <span className="lesson-module-label">
            Module {lesson.module} · {MODULE_NAMES[lesson.module] || ''}
          </span>
          <span className="lesson-week-tag">Week {lesson.week}</span>
          {isConsolidation && (
            <span className="consolidation-tag">Consolidation</span>
          )}
        </div>
        <h1 className="lesson-title">{lesson.title}</h1>
      </div>

      {isConsolidation && (
        <div className="consolidation-banner">
          <div className="consolidation-banner-label">No new skill today</div>
          <p className="consolidation-banner-text">
            Go back to this week's hardest drill and play it at a tempo you genuinely own. Then record 15-30 seconds. You don't need it perfect — you need to hear where you actually are.
          </p>
        </div>
      )}

      <div className="step-cards">
        {lesson.steps.map((step, i) => (
          <StepCard
            key={step.id}
            step={step}
            index={i}
            skillKey={lesson.skill_focus}
            week={lesson.week}
            isConsolidation={isConsolidation}
            progressSet={progressSet}
            onToggleProgress={onToggleProgress}
          />
        ))}
      </div>

      <BpmLogger key={lesson.id} lesson={lesson} bests={bests} onLogBest={onLogBest} />

      <div className="lesson-footer">
        {nextLesson ? (
          <button className="next-lesson-btn" onClick={handleMarkComplete}>
            Mark complete &amp; continue →
          </button>
        ) : (
          <>
            <button
              className="next-lesson-btn next-lesson-btn-final"
              onClick={() => {
                for (const step of lesson.steps) {
                  if (!progressSet.has(`${step.id}:drill`)) {
                    onToggleProgress(step.id, 'drill', true)
                  }
                }
              }}
            >
              Mark complete — week 52 done
            </button>
            <p className="course-complete-msg">
              52 weeks. 260 lessons. That's the programme.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
