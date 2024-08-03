module AuthConcern
  private

  # リクエストヘッダートークンを取得する
  def token_from_request_headers
    request.headers['Authorization']&.split&.last
  end
end
