import { useState } from 'react'
import { EXTRA_VIDEOS } from '../data/videos.js'

function extractYoutubeId(url) {
  if (!url) return null
  const m = url.match(/[?&]v=([^&]+)/)
  return m ? m[1] : null
}

function getLessonThumbnail(lesson) {
  for (const step of lesson.steps) {
    const id = extractYoutubeId(step.video_url)
    if (id) return `https://img.youtube.com/vi/${id}/mqdefault.jpg`
  }
  return null
}

function ModuleAccordion({ module, lessons, isLessonComplete, selectedId, onSelectLesson }) {
  const completed = lessons.filter(isLessonComplete).length
  const total = lessons.length
  const pct = total > 0 ? (completed / total) * 100 : 0
  const containsSelected = lessons.some(l => l.id === selectedId)
  const [open, setOpen] = useState(containsSelected)

  return (
    <div className={`module-accordion${open ? ' is-open' : ''}`}>
      <button className="module-header" onClick={() => setOpen(o => !o)}>
        <div className="module-header-top">
          <span className="module-title">{module.title}</span>
          <span className="module-count">{completed}/{total}</span>
          <span className="module-chevron">›</span>
        </div>
        <div className="module-progress-track">
          <div className="module-progress-fill" style={{ width: `${pct}%` }} />
        </div>
      </button>
      {open && (
        <div className="lesson-list">
          {lessons.map(lesson => {
            const thumb = getLessonThumbnail(lesson)
            const done = isLessonComplete(lesson)
            const selected = lesson.id === selectedId
            return (
              <button
                key={lesson.id}
                className={`lesson-row${selected ? ' selected' : ''}${done ? ' done' : ''}`}
                onClick={() => onSelectLesson(lesson.id)}
              >
                <div className="lesson-thumb">
                  {thumb ? (
                    <img src={thumb} alt="" loading="lazy" />
                  ) : (
                    <div className="lesson-thumb-placeholder">♩</div>
                  )}
                </div>
                <span className="lesson-row-title">{lesson.title}</span>
                {done && <span className="lesson-check">✓</span>}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function Sidebar({ modules, moduleGroups, selectedId, isLessonComplete, onSelectLesson, open }) {
  const [sideQuestsOpen, setSideQuestsOpen] = useState(false)

  return (
    <aside className={`sidebar${open ? ' sidebar-open' : ''}`}>
      <div className="sidebar-inner">
        <div className="sidebar-modules">
          {modules.map(mod => (
            <ModuleAccordion
              key={mod.id}
              module={mod}
              lessons={moduleGroups[mod.id] || []}
              isLessonComplete={isLessonComplete}
              selectedId={selectedId}
              onSelectLesson={onSelectLesson}
            />
          ))}
        </div>
        <div className="side-quests">
          <button
            className="side-quests-header"
            onClick={() => setSideQuestsOpen(o => !o)}
          >
            <span>Side Quests</span>
            <span className={`module-chevron${sideQuestsOpen ? ' is-open' : ''}`} style={sideQuestsOpen ? { transform: 'rotate(90deg)' } : {}}>›</span>
          </button>
          {sideQuestsOpen && (
            <div className="side-quests-list">
              {EXTRA_VIDEOS.map(v => (
                <a
                  key={v.id}
                  href={v.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="side-quest-link"
                >
                  {v.title}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
