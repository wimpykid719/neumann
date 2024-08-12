/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.toml`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {
  BACKEND_URL: string
  FRONTEND_URL: string
}

export default {
  async fetch(request, env, ctx): Promise<Response> {
    const isApiPath = (path: string | undefined) => !!path && path.startsWith('/api/')

    const url = new URL(request.url)
    const isApiRequest = isApiPath(url.pathname)

    const baseUrl = isApiRequest ? env.BACKEND_URL : env.FRONTEND_URL
    const targetUrl = new URL(url.pathname + url.search, baseUrl)
    const modifiedRequest = new Request(targetUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body,
    })

    try {
      return await fetch(modifiedRequest)
    } catch (error) {
      return new Response('Bad Gateway', { status: 502 })
    }
  },
} satisfies ExportedHandler<Env>
