import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

app.use('/api/*', cors())

app.get('/api/health', (c) => c.json({ status: 'ok' }))

app.get('/api/lessons', async (c) => {
  const db = c.env.DB
  const { results } = await db.prepare('SELECT * FROM lessons ORDER BY id').all()
  return c.json(results)
})

export default app
