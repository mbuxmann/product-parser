import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { parseProductRoute } from './routes/parse-product.js'
import { logger } from './utils/logger.js'

const app = new Hono()

app.use('*', async (c, next) => {
  logger.request(c)
  await next()
  logger.response(c, c.res.status)
})

app.route('/parse-product', parseProductRoute)

serve({
  fetch: app.fetch,
  port: 3000
}, (info: { port: number }) => {
  logger.info(`Server is running on http://localhost:${info.port}`)
})
