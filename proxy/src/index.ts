import { createServer, request } from 'http'

const isApiPath = (path: string | undefined) => !!path && path.startsWith('/api/')

createServer((clientReq, clientRes) => {
  const path = clientReq.url
  const isApiRequest = isApiPath(path)
  // クライアントから受け取ったリクエストを、バックエンドサーバに送る処理
  const serverReq = request(isApiRequest ? process.env.BACKEND_URL! : process.env.FRONTEND_URL!, {
    method: clientReq.method,
    path,
    headers: clientReq.headers,
  })
    .on('error', () => clientRes.writeHead(502).end()) // バックエンドサーバとの通信エラーが発生した場合
    .on('timeout', () => clientRes.writeHead(504).end()) // バックエンドサーバとの通信がタイムアウトした場合
    .on('response', serverRes => {
      // バックエンドから受け取ったレスポンスをクライアントに送る処理
      // ステータスコードやヘッダをそのまま送る
      clientRes.writeHead(serverRes.statusCode!, serverRes.headers)
      // HTTPボディはストリームパイプで流す
      serverRes.pipe(clientRes)
    })
  // リクエストのHTTPボディはストリームパイプで流す
  clientReq.pipe(serverReq)
}).listen(process.env.PROXY_PORT) // リバースプロキシサーバのポート
