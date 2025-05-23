import { type Context } from 'hono'

export const logger = {
    info: (message: string, ...args: any[]) => {
        console.log(`[INFO] ${message}`, ...args)
    },

    error: (message: string, error?: any) => {
        console.error(`[ERROR] ${message}`, error)
    },

    request: (c: Context) => {
        const { method, url } = c.req
        logger.info(`${method} ${url}`)
    },

    response: (c: Context, status: number) => {
        const { method, url } = c.req
        logger.info(`${method} ${url} - ${status}`)
    }
} 