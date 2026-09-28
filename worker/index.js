import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { SEED_LESSONS, SEED_STEPS } from './seedData.js'

const app = new Hono()

app.use('/api/*', cors({ origin: '*' }))

// ─── helpers ────────────────────────────────────────────────────────────────

function nestSteps(lessons, steps) {
  const map = {}
  for (const l of lessons) map[l.id] = { ...l, steps: [] }
  for (const s of steps) if (map[s.lesson_id]) map[s.lesson_id].steps.push(s)
  for (const l of Object.values(map)) l.steps.sort((a, b) => a.step_order - b.step_order)
  return Object.values(map).sort((a, b) => a.id - b.id)
}

async function getLessonsWithSteps(db, where = '', bindings = []) {
  const lessonSql = `SELECT * FROM lessons${where ? ' WHERE ' + where : ''} ORDER BY id`
  const stepSql = where
    ? `SELECT s.* FROM steps s INNER JOIN lessons l ON s.lesson_id = l.id WHERE l.${where} ORDER BY s.lesson_id, s.step_order`
    : `SELECT * FROM steps ORDER BY lesson_id, step_order`

  const [{ results: lessons }, { results: steps }] = await Promise.all([
    bindings.length
      ? db.prepare(lessonSql).bind(...bindings).all()
      : db.prepare(lessonSql).all(),
    bindings.length
      ? db.prepare(stepSql).bind(...bindings).all()
      : db.prepare(stepSql).all()
  ])
  return nestSteps(lessons, steps)
}

// ─── health ─────────────────────────────────────────────────────────────────

app.get('/api/health', (c) => c.json({ status: 'ok' }))

// ─── lessons ─────────────────────────────────────────────────────────────────

app.get('/api/lessons', async (c) => {
  try {
    const db = c.env.DB
    const { results: lessons } = await db.prepare('SELECT * FROM lessons ORDER BY id').all()
    const { results: steps } = await db.prepare('SELECT * FROM steps ORDER BY lesson_id, step_order').all()
    return c.json(nestSteps(lessons, steps))
  } catch (e) {
    console.error(e)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

app.get('/api/lessons/week/:week', async (c) => {
  try {
    const week = parseInt(c.req.param('week'), 10)
    if (isNaN(week) || week < 1 || week > 52) return c.json({ error: 'Invalid week' }, 400)
    const db = c.env.DB
    const { results: lessons } = await db.prepare('SELECT * FROM lessons WHERE week = ? ORDER BY id').bind(week).all()
    const ids = lessons.map(l => l.id)
    if (!ids.length) return c.json([])
    const { results: steps } = await db.prepare(
      `SELECT * FROM steps WHERE lesson_id IN (${ids.map(() => '?').join(',')}) ORDER BY lesson_id, step_order`
    ).bind(...ids).all()
    return c.json(nestSteps(lessons, steps))
  } catch (e) {
    console.error(e)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

app.get('/api/lessons/module/:module', async (c) => {
  try {
    const mod = parseInt(c.req.param('module'), 10)
    if (isNaN(mod) || mod < 1 || mod > 8) return c.json({ error: 'Invalid module' }, 400)
    const db = c.env.DB
    const { results: lessons } = await db.prepare('SELECT * FROM lessons WHERE module = ? ORDER BY id').bind(mod).all()
    const ids = lessons.map(l => l.id)
    if (!ids.length) return c.json([])
    const { results: steps } = await db.prepare(
      `SELECT * FROM steps WHERE lesson_id IN (${ids.map(() => '?').join(',')}) ORDER BY lesson_id, step_order`
    ).bind(...ids).all()
    return c.json(nestSteps(lessons, steps))
  } catch (e) {
    console.error(e)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Specific lesson by id — must come after /week/:week and /module/:module
app.get('/api/lessons/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'), 10)
    if (isNaN(id)) return c.json({ error: 'Invalid id' }, 400)
    const db = c.env.DB
    const lesson = await db.prepare('SELECT * FROM lessons WHERE id = ?').bind(id).first()
    if (!lesson) return c.json({ error: 'Not found' }, 404)
    const { results: steps } = await db.prepare('SELECT * FROM steps WHERE lesson_id = ? ORDER BY step_order').bind(id).all()
    return c.json({ ...lesson, steps })
  } catch (e) {
    console.error(e)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// ─── progress ────────────────────────────────────────────────────────────────

app.get('/api/progress', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(
      'SELECT step_id, type, done, updated_at FROM progress ORDER BY updated_at DESC'
    ).all()
    return c.json(results)
  } catch (e) {
    console.error(e)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

app.get('/api/progress/lesson/:lessonId', async (c) => {
  try {
    const lessonId = parseInt(c.req.param('lessonId'), 10)
    if (isNaN(lessonId)) return c.json({ error: 'Invalid lessonId' }, 400)
    const db = c.env.DB
    const { results } = await db.prepare(
      `SELECT p.step_id, p.type, p.done, p.updated_at
       FROM progress p
       INNER JOIN steps s ON p.step_id = s.id
       WHERE s.lesson_id = ?
       ORDER BY s.step_order, p.type`
    ).bind(lessonId).all()
    return c.json(results)
  } catch (e) {
    console.error(e)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

app.post('/api/progress', async (c) => {
  try {
    const body = await c.req.json()
    const { step_id, type, done } = body

    if (!Number.isInteger(step_id) || step_id < 1) return c.json({ error: 'step_id must be a positive integer' }, 400)
    if (type !== 'watch' && type !== 'drill') return c.json({ error: 'type must be watch or drill' }, 400)
    if (typeof done !== 'boolean') return c.json({ error: 'done must be a boolean' }, 400)

    const db = c.env.DB
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19)
    await db.prepare(
      `INSERT INTO progress (step_id, type, done, updated_at) VALUES (?, ?, ?, ?)
       ON CONFLICT(step_id, type) DO UPDATE SET done = excluded.done, updated_at = excluded.updated_at`
    ).bind(step_id, type, done ? 1 : 0, now).run()

    const row = await db.prepare('SELECT step_id, type, done, updated_at FROM progress WHERE step_id = ? AND type = ?').bind(step_id, type).first()
    return c.json(row)
  } catch (e) {
    console.error(e)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// ─── personal bests ──────────────────────────────────────────────────────────

app.get('/api/bests', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(
      'SELECT skill_key, value, unit, logged_at FROM personal_bests ORDER BY skill_key'
    ).all()
    return c.json(results)
  } catch (e) {
    console.error(e)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

app.post('/api/bests', async (c) => {
  try {
    const body = await c.req.json()
    const { skill_key, value, unit, lesson_id } = body

    if (!skill_key || typeof skill_key !== 'string' || !skill_key.trim()) return c.json({ error: 'skill_key must be a non-empty string' }, 400)
    if (typeof value !== 'number' || value <= 0) return c.json({ error: 'value must be a positive number' }, 400)
    if (!unit || typeof unit !== 'string' || !unit.trim()) return c.json({ error: 'unit must be a non-empty string' }, 400)

    const db = c.env.DB
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19)

    // Always log to bpm_log (full history)
    if (lesson_id && Number.isInteger(lesson_id)) {
      await db.prepare(
        'INSERT INTO bpm_log (lesson_id, skill_key, value, unit, logged_at) VALUES (?, ?, ?, ?, ?)'
      ).bind(lesson_id, skill_key, value, unit, now).run()
    }

    // Only update personal_bests if new value is higher
    const existing = await db.prepare('SELECT value FROM personal_bests WHERE skill_key = ?').bind(skill_key).first()
    if (!existing || value > existing.value) {
      await db.prepare(
        `INSERT INTO personal_bests (skill_key, value, unit, logged_at) VALUES (?, ?, ?, ?)
         ON CONFLICT(skill_key) DO UPDATE SET value = excluded.value, unit = excluded.unit, logged_at = excluded.logged_at`
      ).bind(skill_key, value, unit, now).run()
    }

    const best = await db.prepare('SELECT skill_key, value, unit, logged_at FROM personal_bests WHERE skill_key = ?').bind(skill_key).first()
    return c.json({ best, logged: value, is_new_best: !existing || value > existing.value })
  } catch (e) {
    console.error(e)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// ─── bpm log ─────────────────────────────────────────────────────────────────

app.get('/api/log/:skillKey', async (c) => {
  try {
    const skillKey = c.req.param('skillKey')
    const { results } = await c.env.DB.prepare(
      'SELECT lesson_id, skill_key, value, unit, logged_at FROM bpm_log WHERE skill_key = ? ORDER BY logged_at DESC LIMIT 100'
    ).bind(skillKey).all()
    return c.json(results)
  } catch (e) {
    console.error(e)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// ─── streak ──────────────────────────────────────────────────────────────────

app.get('/api/streak', async (c) => {
  try {
    const db = c.env.DB
    // Get all distinct dates with at least one done=1 progress entry, newest first
    const { results } = await db.prepare(
      `SELECT DISTINCT date(updated_at) as day FROM progress WHERE done = 1 ORDER BY day DESC`
    ).all()

    const days = results.map(r => r.day)
    if (!days.length) return c.json({ streak: 0, longest: 0 })

    const today = new Date().toISOString().slice(0, 10)

    // Current streak: consecutive days ending today
    let streak = 0
    if (days[0] === today) {
      let expected = today
      for (const day of days) {
        if (day === expected) {
          streak++
          const d = new Date(expected)
          d.setDate(d.getDate() - 1)
          expected = d.toISOString().slice(0, 10)
        } else {
          break
        }
      }
    }

    // Longest streak: scan all days in sorted order
    const sorted = [...days].sort()
    let longest = 0
    let run = 1
    for (let i = 1; i < sorted.length; i++) {
      const prev = new Date(sorted[i - 1])
      const curr = new Date(sorted[i])
      const diff = (curr - prev) / 86400000
      if (diff === 1) {
        run++
        longest = Math.max(longest, run)
      } else {
        run = 1
      }
    }
    longest = Math.max(longest, 1, streak)

    return c.json({ streak, longest })
  } catch (e) {
    console.error(e)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// ─── seed (dev only) ─────────────────────────────────────────────────────────

app.post('/api/seed', async (c) => {
  try {
    const db = c.env.DB
    const { results: [{ count }] } = await db.prepare('SELECT COUNT(*) as count FROM lessons').all()
    if (count > 0) return c.json({ message: 'Already seeded', count })

    // Batch-insert lessons first, then steps
    const lessonStmts = SEED_LESSONS.map(l =>
      db.prepare(
        'INSERT OR IGNORE INTO lessons (id, week, day_in_week, module, lesson_in_module, is_consolidation, title, skill_focus) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
      ).bind(l.id, l.week, l.day_in_week, l.module, l.lesson_in_module, l.is_consolidation, l.title, l.skill_focus)
    )

    // D1 batch limit is 100 statements — chunk them
    for (let i = 0; i < lessonStmts.length; i += 100) {
      await db.batch(lessonStmts.slice(i, i + 100))
    }

    const stepStmts = SEED_STEPS.map(s =>
      db.prepare(
        'INSERT OR IGNORE INTO steps (id, lesson_id, step_order, type, video_id, video_title, video_url, instruction, bpm_target, stamina_target_seconds) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
      ).bind(s.id, s.lesson_id, s.step_order, s.type, s.video_id, s.video_title, s.video_url, s.instruction, s.bpm_target, s.stamina_target_seconds)
    )

    for (let i = 0; i < stepStmts.length; i += 100) {
      await db.batch(stepStmts.slice(i, i + 100))
    }

    return c.json({ seeded: true, lessons: SEED_LESSONS.length, steps: SEED_STEPS.length })
  } catch (e) {
    console.error(e)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

export default app
