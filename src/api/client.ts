import { API_BASE_URL } from '../config'

export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export type QueryValue = string | number | boolean | number[] | undefined

function buildUrl(path: string, query?: Record<string, QueryValue>): string {
  const url = new URL(`${API_BASE_URL}${path}`, window.location.origin)
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value === undefined || value === '') continue
    const values = Array.isArray(value) ? value : [value]
    values.forEach((item) => url.searchParams.append(key, String(item)))
  }
  return url.toString()
}

async function parseError(response: Response): Promise<ApiError> {
  const body = await response.json().catch(() => null)
  const detail = body?.detail
  const message = typeof detail === 'string' ? detail : response.statusText
  return new ApiError(response.status, message || 'Request failed')
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  query?: Record<string, QueryValue>
  body?: unknown
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await fetch(buildUrl(path, options.query), {
    method: options.method ?? 'GET',
    headers: options.body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  })

  if (!response.ok) throw await parseError(response)
  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}
