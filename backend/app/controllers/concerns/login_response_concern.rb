module LoginResponseConcern
  extend ActiveSupport::Concern

  private

  def login_response_with_cookie(user)
    refresh_token = user.generate_refresh_token
    access_token = user.generate_access_token
    refresh_token_to_cookie(refresh_token)

    login_response(access_token)
  end

  # refresh_tokenをcookieにセットする
  def refresh_token_to_cookie(refresh_token)
    payload = refresh_token.payload

    cookies[UserAuthConfig.session_key] = {
      value: refresh_token.token,
      expires: Time.zone.at(payload[:exp]),
      secure: Rails.env.production?,
      http_only: true
    }
  end

  # ログイン時のデフォルトレスポンス
  def login_response(access_token)
    { token: access_token.token }
  end
end
