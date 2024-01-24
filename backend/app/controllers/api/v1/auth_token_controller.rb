class Api::V1::AuthTokenController < ApplicationController
  include UserAuth::SessionService

  # 各アクションでの例外をここで拾う
  rescue_from UserAuthConfig.not_found_exception_class, with: :status_not_found
  rescue_from Constants::Exceptions::TokenVersion do |error|
    unauthorized_user(error.message)
  end

  before_action :sessionize_user, only: [:refresh, :destroy]

  # ログイン
  def create
    delete_session

    authenticated_user = User.logged_in_user(email: auth_params['email'], password: auth_params['password'])
    refresh_token = authenticated_user.generate_refresh_token
    access_token = authenticated_user.generate_access_token

    refresh_token_to_cookie(refresh_token)

    render status: :created, json: login_response(access_token)
  end

  # リフレッシュ
  def refresh
    refresh_token = session_user.generate_refresh_token
    access_token = session_user.generate_access_token

    refresh_token_to_cookie(refresh_token)
    render status: :created, json: login_response(access_token)
  end

  # ログアウト
  def destroy
    delete_session if session_user.delete_token_version
    head(:ok) if cookies[UserAuthConfig.session_key].nil?
  end

  private

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

  def auth_params
    params.require(:auth).permit(:email, :password)
  end
end
