import { useState, useEffect, useMemo } from 'react'
import TopBar from './components/TopBar.jsx'
import Sidebar from './components/Sidebar.jsx'
import LessonPane from './components/LessonPane.jsx'
import { MODULES } from './data/modules.js'
import './index.css'

export default function App() {
  const [lessons, setLessons] = useState([])
  const [progress, setProgress] = useState([])
  const [bests, setBests] = useState([])
  const [streak, setStreak] = useState(0)
  const [selectedId, setSelectedId] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([
      fetch('/api/lessons').then(r => { if (!r.ok) throw new Error(`/api/lessons ${r.status}`); return r.json() }),
      fetch('/api/progress').then(r => { if (!r.ok) throw new Error(`/api/progress ${r.status}`); return r.json() }),
      fetch('/api/bests').then(r => r.ok ? r.json() : []),
      fetch('/api/streak').then(r => r.ok ? r.json() : { streak: 0 }),
    ])
      .then(([ls, pr, bs, sk]) => {
        const lessonArr = Array.isArray(ls) ? ls : []
        setLessons(lessonArr)
        setProgress(Array.isArray(pr) ? pr : [])
        setBests(Array.isArray(bs) ? bs : [])
        setStreak(sk?.streak || 0)
        if (lessonArr.length > 0) setSelectedId(lessonArr[0].id)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  const progressSet = useMemo(() => {
    const s = new Set()
    for (const p of progress) {
      if (p.done) s.add(`${p.step_id}:${p.type}`)
    }
    return s
  }, [progress])

  const isLessonComplete = (lesson) =>
    lesson.steps.length > 0 &&
    lesson.steps.every(step => progressSet.has(`${step.id}:drill`))

  async function handleToggleProgress(stepId, type, done) {
    setProgress(prev => {
      const idx = prev.findIndex(p => p.step_id === stepId && p.type === type)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = { ...next[idx], done: done ? 1 : 0 }
        return next
      }
      return [...prev, { step_id: stepId, type, done: done ? 1 : 0 }]
    })
    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step_id: stepId, type, done })
      })
      const res = await fetch('/api/streak')
      if (res.ok) {
        const data = await res.json()
        setStreak(data.streak || 0)
      }
    } catch (e) {
      console.error('Progress save failed:', e)
    }
  }

  async function handleLogBest(skillKey, value, unit, lessonId) {
    try {
      const res = await fetch('/api/bests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skill_key: skillKey, value, unit, lesson_id: lessonId })
      })
      if (!res.ok) return null
      const data = await res.json()
      if (data.best) {
        setBests(prev => [...prev.filter(b => b.skill_key !== skillKey), data.best])
      }
      return data
    } catch (e) {
      console.error('Log best failed:', e)
      return null
    }
  }

  const moduleGroups = useMemo(() => {
    const groups = {}
    for (const lesson of lessons) {
      if (!groups[lesson.module]) groups[lesson.module] = []
      groups[lesson.module].push(lesson)
    }
    return groups
  }, [lessons])

  const completedCount = useMemo(
    () => lessons.filter(isLessonComplete).length,
    [lessons, progressSet]
  )

  const selectedLesson = lessons.find(l => l.id === selectedId) || null

  function handleSelectLesson(id) {
    setSelectedId(id)
    setSidebarOpen(false)
  }

  return (
    <div className="app">
      <TopBar
        completed={completedCount}
        total={lessons.length}
        streak={streak}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(o => !o)}
      />
      <div className="app-body">
        <Sidebar
          modules={MODULES}
          moduleGroups={moduleGroups}
          selectedId={selectedId}
          isLessonComplete={isLessonComplete}
          onSelectLesson={handleSelectLesson}
          open={sidebarOpen}
        />
        {sidebarOpen && (
          <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
        )}
        <main className="main-pane">
          {loading && <div className="loading">Loading lessons...</div>}
          {error && (
            <div className="loading" style={{ flexDirection: 'column', gap: 8 }}>
              <span>Could not load lessons.</span>
              <span style={{ fontSize: 12, opacity: 0.6 }}>
                Make sure the Worker is running: npm run worker:dev
              </span>
              <span style={{ fontSize: 11, opacity: 0.4 }}>{error}</span>
            </div>
          )}
          {!loading && !error && selectedLesson && (
            <LessonPane
              lesson={selectedLesson}
              progressSet={progressSet}
              lessons={lessons}
              onSelectLesson={handleSelectLesson}
              onToggleProgress={handleToggleProgress}
              onLogBest={handleLogBest}
              bests={bests}
            />
          )}
          {!loading && !error && !selectedLesson && (
            <div className="loading">No lesson selected.</div>
          )}
        </main>
      </div>
    </div>
  )
}
