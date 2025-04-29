import { Hono } from 'hono'
import { z } from 'zod'
import { services } from '../services'
import OpenAI from 'openai'
import { logger } from '../utils/logger.js'

const parseProductRoute = new Hono()

const RequestBodySchema = z.object({
    url: z.string().url(),
    openaiApiKey: z.string()
})

parseProductRoute.post('/', async (c) => {
    try {
        const body = await c.req.json()
        const parsed = RequestBodySchema.safeParse(body)

        if (!parsed.success) {
            const errors = parsed.error.flatten().fieldErrors
            logger.error('Invalid request body', errors)

            return c.json(
                {
                    error: "Invalid request body",
                    details: errors
                },
                400
            )
        }

        const { url, openaiApiKey } = parsed.data
        logger.info('Processing product extraction', { url })

        const openai = new OpenAI({ apiKey: openaiApiKey })
        const extractor = new services.ExtractorService(openai)
        const product = await extractor.extractProduct(url)

        logger.info('Successfully extracted product', { url, title: product.title })
        return c.json({ product })
    } catch (error) {
        logger.error('Error processing request', error)
        return c.json({ error: error instanceof Error ? error.message : 'Unexpected error' }, 400)
    }
})

export { parseProductRoute }