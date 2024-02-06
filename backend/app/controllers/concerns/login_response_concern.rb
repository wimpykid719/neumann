module LoginResponseConcern
  extend ActiveSupport::Concern

  private

  def login_response_with_cookie(user)
    refresh_token = user.generate_refresh_token
    access_token = user.generate_access_token
    refresh_token_to_cookie(refresh_token)

    login_response(access_token)
  end

  def login_response(access_token)
    { token: access_token.token }
  end
end
