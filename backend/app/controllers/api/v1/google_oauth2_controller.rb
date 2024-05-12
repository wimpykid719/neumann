class Api::V1::GoogleOauth2Controller < ApplicationController
  include LoginResponseConcern

  rescue_from Constants::Exceptions::SignUp, Constants::Exceptions::TokenLifetime, ActiveRecord::RecordInvalid do |error|
    status_unprocessable_entity(error.message)
  end

  def authorization_url
    account = Oauth2::Google::Account.new
    render status: :ok, json: { authorization_url: account.authorization_url }
  end

  def create
    delete_session

    user_authed = User.from_google_oauth2(user_params)
    render status: :created, json: login_response_with_cookie(user_authed)
  end

  private

  def oauth_params
    params.require(:oauth2).permit(:code, :state)
  end

  def user_params
    account = Oauth2::Google::Account.new
    user_info = account.info(oauth_params)
    {
      provider: 'google',
      name: user_info['name'],
      email: user_info['email'],
      picture: user_info['picture']
    }
  end
end
