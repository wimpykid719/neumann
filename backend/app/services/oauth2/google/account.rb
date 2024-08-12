require 'jwt'
require 'oauth2'

module Oauth2
  module Google
    class Account
      include Oauth2Concern

      ALLOWED_ISSUERS = ['accounts.google.com', 'https://accounts.google.com'].freeze
      BASE_SCOPE_URL = 'https://www.googleapis.com/auth/'.freeze
      BASE_SCOPES = %w[profile email openid].freeze
      DEFAULT_SCOPE = 'email,profile'.freeze
      USER_INFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo'.freeze
      CLIENT_OPTIONS = {
        site: 'https://oauth2.googleapis.com',
        authorize_url: 'https://accounts.google.com/o/oauth2/auth',
        token_url: '/token'
      }.freeze
      AUTHORIZE_PARAMS = {
        redirect_uri: ENV.fetch('PROXY_MODE', 'false') == 'true' ? ENV.fetch('FRONT_REDIRECT_URI_PROXY') : ENV.fetch('FRONT_REDIRECT_URI')
      }.freeze

      def initialize
        @client = OAuth2::Client.new(ENV.fetch('GOOGLE_CLIENT_ID'), ENV.fetch('GOOGLE_CLIENT_SECRET'), CLIENT_OPTIONS)
      end

      def authorization_url
        @client.auth_code.authorize_url(AUTHORIZE_PARAMS.merge(authorize_params_option))
      end

      def info(verifier_params)
        state = verifier_params[:state]
        code = verifier_params[:code]

        return nil unless valid_state_jwt?(state)

        code_decoded = URI.decode_www_form_component(code)
        client_authorized = @client.auth_code.get_token(code_decoded, AUTHORIZE_PARAMS)
        client_authorized.get(USER_INFO_URL).parsed
      end

      private

      def authorize_params_option
        {
          state: state_jwt,
          scope: scope_url
        }
      end

      def state_jwt
        JWT.encode({ iss:, aud:, exp: token_lifetime.from_now.to_i }, secret_key, algorithm, header_fields)
      end

      def scope_url
        scope_list = DEFAULT_SCOPE.split.map { |item| item.split(',') }.flatten
        scope_list.map! { |s| s =~ %r{^https?://} || BASE_SCOPES.include?(s) ? s : "#{BASE_SCOPE_URL}#{s}" }
        scope_list.join(' ')
      end

      def valid_state_jwt?(state)
        payload = JWT.decode(state, secret_key, true, verify_claims).first
        payload.with_indifferent_access[:iss].present?
      rescue JWT::ExpiredSignature
        raise Constants::Exceptions::TokenLifetime, I18n.t('errors.request.state_lifetime')
      rescue JWT::DecodeError
        false
      end

      def verify_claims
        {
          iss:,
          aud:,
          verify_expiration: true,
          verify_iss: true,
          verify_aud: true,
          algorithm:
        }
      end
    end
  end
end
