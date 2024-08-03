require 'jwt'

module Analytic
  class CronRequestAuth
    include TokenConcern

    attr_reader :token

    def initialize
      @token = JWT.encode(claims, secret_key, algorithm, header_fields)
    end

    class << self
      def valid_cron_request_jwt?(state)
        payload = JWT.decode(state, secret_key, true, verify_claims).first
        payload.with_indifferent_access[:iss].present?
      rescue JWT::DecodeError
        false
      end

      private

      def verify_claims
        {
          iss:,
          aud:,
          verify_iss: true,
          verify_aud: true,
          algorithm:
        }
      end
    end

    private

    def claims
      {
        iss:,
        aud:
      }
    end
  end
end
