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

function StepCard({ step, index, skillKey, week }) {
  const ytId = extractYoutubeId(step.video_url)
  const isExternalLink = step.video_url && !ytId
  const details = getStepDetails(step, skillKey, week)

  return (
    <div className="step-card">
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
    </div>
  )
}

export default function LessonPane({ lesson, progressSet, lessons, onSelectLesson }) {
  const currentIndex = lessons.findIndex(l => l.id === lesson.id)
  const nextLesson = currentIndex >= 0 && currentIndex < lessons.length - 1
    ? lessons[currentIndex + 1]
    : null

  return (
    <div className="lesson-pane">
      <div className="lesson-header">
        <div className="lesson-meta">
          <span className="lesson-module-label">
            Module {lesson.module} · {MODULE_NAMES[lesson.module] || ''}
          </span>
          <span className="lesson-week-tag">Week {lesson.week}</span>
          {Boolean(lesson.is_consolidation) && (
            <span className="consolidation-tag">Consolidation</span>
          )}
        </div>
        <h1 className="lesson-title">{lesson.title}</h1>
      </div>

      <div className="step-cards">
        {lesson.steps.map((step, i) => (
          <StepCard key={step.id} step={step} index={i} skillKey={lesson.skill_focus} week={lesson.week} />
        ))}
      </div>

      {nextLesson && (
        <div className="lesson-footer">
          <button
            className="next-lesson-btn"
            onClick={() => {
              onSelectLesson(nextLesson.id)
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          >
            Mark complete &amp; continue →
          </button>
        </div>
      )}
    </div>
  )
}
