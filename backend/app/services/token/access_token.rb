require 'jwt'

module Token
  class AccessToken
    include TokenConcern

    attr_reader :payload, :token

    def initialize(user_id, options: {})
      @payload = claims(user_id).merge(options)
      @token = JWT.encode(@payload, secret_key, algorithm, header_fields)
    end

    class << self
      def decode(token)
        JWT.decode(token.to_s, UserAuthConfig.token_secret_signature_key, true).first
      end
    end

    # @lifetimeの日本語テキストを返す
    def lifetime_text
      time, period = token_lifetime.inspect.chomp('s').split
      time + I18n.t("datetime.prompts.#{period}", default: '')
    end

    private

    # アクセストークンの有効期限
    def token_lifetime
      UserAuthConfig.access_token_lifetime
    end

    # 有効期限をUnixtimeで返す(必須)
    def token_expiration
      token_lifetime.from_now.to_i
    end

    def user_current_token_version(user_id)
      token_version = User.find_by(id: user_id).current_token_version
      raise 'TokenVersion Is Nil' if token_version.nil?

      token_version
    end

    # エンコード時のデフォルトクレーム
    def claims(user_id)
      {
        iss:,
        aud:,
        user_claim => encrypt_for(user_id),
        exp: token_expiration,
        version: user_current_token_version(user_id)
      }
    end
  end
end
