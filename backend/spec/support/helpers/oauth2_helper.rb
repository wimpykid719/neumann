module Oauth2Helper
  AUTHORIZE_PARAMS = { redirect_uri: ENV.fetch('FRONT_REDIRECT_URI') }.freeze
  CLIENT_OPTIONS = {
    site: 'https://oauth2.googleapis.com',
    authorize_url: 'https://accounts.google.com/o/oauth2/auth',
    token_url: '/token'
  }.freeze
  USER_INFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo'.freeze

  RSpec.shared_context 'oauth2_helper', shared_context: :metadata do
    let(:state_jwt) do
      authorization_url = Oauth2::Google::Account.new.authorization_url
      expect(authorization_url).to be_present

      uri = URI.parse(authorization_url)
      params = URI.decode_www_form(uri.query || '').to_h
      params['state']
    end
    let(:auth_code_mock) { instance_double(OAuth2::Strategy::AuthCode) }

    def setup_google_oauth2_mock
      google_oauth2_client_mock = instance_double(OAuth2::Client)
      auth_code_mock = instance_double(OAuth2::Strategy::AuthCode)
      client_authorized_mock = instance_double(OAuth2::AccessToken)
      code_decoded = 'fake_code'
      user_info = {
        'sub' => '123',
        'name' => 'neumann',
        'given_name' => 'neumann',
        'picture' => 'https://lh3.googleusercontent.com/a/test',
        'email' => 'neumann@gmail.com',
        'email_verified' => true,
        'locale' => 'ja'
      }

      allow(OAuth2::Client).to receive(:new)
        .with(ENV.fetch('GOOGLE_CLIENT_ID'), ENV.fetch('GOOGLE_CLIENT_SECRET'), CLIENT_OPTIONS)
        .and_return(google_oauth2_client_mock)
      allow(google_oauth2_client_mock).to receive(:auth_code).and_return(auth_code_mock)
      allow(auth_code_mock).to receive(:get_token)
        .with(code_decoded, AUTHORIZE_PARAMS).and_return(client_authorized_mock)
      allow(client_authorized_mock).to receive(:get)
        .with(USER_INFO_URL)
        .and_return(instance_double(OAuth2::Response, parsed: user_info))
    end
  end
end
