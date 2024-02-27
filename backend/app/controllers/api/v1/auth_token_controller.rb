class Api::V1::AuthTokenController < ApplicationController
  include UserAuth::SessionService
  include LoginResponseConcern

  # 各アクションでの例外をここで拾う
  rescue_from UserAuthConfig.not_found_exception_class, with: :status_failed_login
  rescue_from Constants::Exceptions::TokenVersion do |error|
    unauthorized_user(error.message)
  end

  before_action :sessionize_user, only: [:refresh, :destroy]

  # ログイン
  def create
    delete_session
    authenticated_user = User.logged_in_user(email: auth_params['email'], password: auth_params['password'])

    render status: :created, json: login_response_with_cookie(authenticated_user)
  end

  # リフレッシュ
  def refresh
    render status: :created, json: login_response_with_cookie(session_user)
  end

  # ログアウト
  def destroy
    delete_session if session_user.delete_token_version
    head(:no_content) if cookies[UserAuthConfig.session_key].nil?
  end

  private

  def auth_params
    params.require(:auth).permit(:email, :password)
  end
end
