import { FetchError } from '@/lib/errors'
import requestErrorText from '@/text/request.json'

type Options<T = object> = {
  params?: T
  headers?: HeadersInit
  credentials?: Request['credentials']
  revalidate?: number
}

/** 絶対URLかどうかを判定する　*/
function isAbsoluteURL(url: string): boolean {
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url)
}

/** URLとパスを連結する */
function combineUrls(baseURL: string, relativeURL: string): string {
  return relativeURL ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '') : baseURL
}

/** URLを構築する */
function buildFullPath(baseURL: string, requestedURL: string): string {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineUrls(baseURL, requestedURL)
  }
  return requestedURL
}

/** リクエストヘッダを構築する */
function buildHeaders<T = HeadersInit>(headers?: T): HeadersInit {
  const defaultHeaders = {
    'X-Requested-With': 'XMLHttpRequest',
  }

  if (!headers) {
    return {
      ...defaultHeaders,
    }
  }

  return {
    ...defaultHeaders,
    ...headers,
  }
}

/**
 * ローカル環境以外はセキュリティのためcredentialsをデフォルト値("same-origin")とする
 * @see https://developer.mozilla.org/ja/docs/Web/API/Request/credentials
 */
function buildCredentials(credentials?: Request['credentials']): Request['credentials'] | undefined {
  if (process.env.NODE_ENV !== 'development') {
    return undefined
  }

  return credentials
}

/** リクエストボディを構築する */
function buildRequestBody<T = object>(body: T): string | FormData | null {
  // FormDataの場合、 `JSON.stringify()` せずそのまま返す
  if (body instanceof FormData) return body

  // bodyがnull,undefinedの場合はnullを返して終了する
  // JSON.stringifyにnullを渡すとエラーになるため
  if (!body) return null

  return JSON.stringify(body)
}

/** クエリパラメータ付きのURLパスを構築する */
function buildPathWithSearchParams<T = object>(path: string, params?: T) {
  // パラメータがない場合、URLパスをそのまま返す
  if (!params || Object.keys(params).length === 0) return path

  for (const key in params) {
    if (params[key] === undefined) {
      // URLSearchParamsで`key="undefined"`になるので削除する
      delete params[key]
    }
  }

  const urlSearchParams = new URLSearchParams(params)
  return `${path}?${urlSearchParams.toString()}`
}

/** 通信処理を共通化した関数 */
async function http<T>(path: string, config: RequestInit, revalidate = 0): Promise<T | FetchError> {
  const apiUrl =
    process.env.NEXT_PUBLIC_PROXY_MODE === 'true'
      ? process.env.NEXT_PUBLIC_API_URL_PROXY!
      : process.env.NEXT_PUBLIC_API_URL!
  const request = new Request(
    // API_URLは必ず値が存在する想定なので `!` で型エラーを回避する
    buildFullPath(process.env.API_URL_FROM_SERVER || apiUrl, path),
    config,
  )

  const res = await fetch(request, { next: { revalidate } })

  if (!res.ok) {
    try {
      const data = await res.json()
      return new FetchError(data.error.message, res.status)
    } catch {
      return new FetchError(requestErrorText.internal_server_error, res.status)
    }
  }

  // statusCodeが204のときにres.json()を実行するとエラーになるため
  if (res.status === 204) return {} as T

  return (await res.json()) as T
}

export async function get<T, U = object>(path: string, options?: Options<U>): Promise<T | FetchError> {
  return http<T>(
    buildPathWithSearchParams(path, options?.params ? options.params : undefined),
    {
      headers: buildHeaders(options?.headers),
      credentials: buildCredentials(options?.credentials),
    },
    options?.revalidate,
  )
}

export async function post<T, U, V = object>(path: string, body: T, options?: Options<V>): Promise<U | FetchError> {
  return http<U>(path, {
    method: 'POST',
    headers: buildHeaders(options?.headers),
    body: buildRequestBody(body),
    credentials: buildCredentials(options?.credentials),
  })
}

export async function put<T, U = object>(path: string, body: T, options?: Options<U>): Promise<U | FetchError> {
  return http<U>(path, {
    method: 'PUT',
    body: buildRequestBody(body),
    headers: buildHeaders(options?.headers),
    credentials: buildCredentials(options?.credentials),
  })
}

export async function patch<T, U = object>(path: string, body: T, options?: Options<U>): Promise<U | FetchError> {
  return http<U>(path, {
    method: 'PATCH',
    body: buildRequestBody(body),
    headers: buildHeaders(options?.headers),
    credentials: buildCredentials(options?.credentials),
  })
}

// deleteはJSの予約語であるためdestroyとする
export async function destroy<T = object>(path: string, options?: Options<T>): Promise<T | FetchError> {
  return http<T>(buildPathWithSearchParams(path, options?.params ? options.params : undefined), {
    method: 'DELETE',
    headers: buildHeaders(options?.headers),
    credentials: buildCredentials(options?.credentials),
  })
}
