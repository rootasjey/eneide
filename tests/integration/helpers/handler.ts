import { createEvent } from 'h3'
import type { EventHandler } from 'h3'
import { IncomingMessage, ServerResponse } from 'node:http'
import { Socket } from 'node:net'

function createMockReqRes(options: {
  path?: string
  method?: string
  headers?: Record<string, string>
  body?: string
}) {
  const url = options.path || '/'
  const socket = new Socket()
  const req = new IncomingMessage(socket)
  req.url = url
  req.method = options.method || 'GET'
  const headers = { 'content-type': 'application/json', ...options.headers }
  if (options.body) {
    headers['content-length'] = String(Buffer.byteLength(options.body, 'utf-8'))
  }
  req.headers = headers
  const res = new ServerResponse(req)
  if (options.body) {
    req.push(options.body)
    req.push(null)
  }
  return { req, res }
}

export function createHandlerEvent(options: {
  path?: string
  query?: Record<string, string>
  method?: string
  body?: any
  headers?: Record<string, string>
  params?: Record<string, string>
} = {}) {
  const query = options.query ? new URLSearchParams(options.query).toString() : ''
  const path = query ? `${options.path || '/'}?${query}` : (options.path || '/')
  const bodyStr = options.body !== undefined ? JSON.stringify(options.body) : undefined
  const { req, res } = createMockReqRes({
    path,
    method: options.method || 'GET',
    headers: options.headers,
    body: bodyStr,
  })
  const event = createEvent(req, res)
  if (options.params) {
    event.context.params = options.params
  }
  return event
}

export async function callHandler(handler: EventHandler, options?: Parameters<typeof createHandlerEvent>[0]) {
  const event = createHandlerEvent(options)
  return handler(event)
}
